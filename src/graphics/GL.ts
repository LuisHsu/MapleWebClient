/** 
 *  #### Coordinate system
 *  * Model => Origin: bottom center, Positive: up, right
 *  * View => Origin: bottom left, Positive: up, right
 * 
 *  @category Graphics
 *  @module GL
 */

import Setting from "../Setting";
import {Texture} from "./Texture";
import Window from "../io/Window";
import {Point, Size} from "../Types";

const gl = (document.getElementById("screen") as HTMLCanvasElement).getContext("webgl");
const vertex_array = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);
const coordinate_array = new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]);


export interface Drawable{
    draw: () => void;
}

export class Transform {
    constructor(initializer?: {rotate?: number, offset?: Point, scale?: Size, opacity?: number}){
        if(initializer){
            if(typeof(initializer.rotate) !== "undefined"){
                this.rotate = initializer.rotate;
            }
            if(typeof(initializer.offset) !== "undefined"){
                this.offset = initializer.offset;
            }
            if(typeof(initializer.scale) !== "undefined"){
                this.scale = initializer.scale;
            }
            if(typeof(initializer.opacity) !== "undefined"){
                this.opacity = initializer.opacity;
            }
        }
    }
    rotate: number = 0.0;
    offset: Point = new Point(0, 0);
    scale: Size = new Size(1, 1);
    opacity: number = 1.0;
};

export class GL {
    init(): void {
        // Clear color
        gl.clearColor(0, 0, 0, 1);
        // Alpha blending
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Shaders
        const vertexShader: WebGLShader = load_shader(gl.VERTEX_SHADER,`
            attribute vec2 vertex_pos;
            attribute vec2 tex_coord;
            uniform vec4 vertex_rect;
            uniform float rotate;
            varying vec2 texcoord;
            void main(void){
                vec2 scaled_pos = vertex_pos.xy * vertex_rect.zw;
                float rotate_sin = sin(radians(rotate));
                float rotate_cos = cos(radians(rotate));
                vec2 rotated_pos = mat2(rotate_cos, -rotate_sin, rotate_sin, rotate_cos) * scaled_pos;
                gl_Position = vec4(
                    (vertex_rect.x + rotated_pos.x / 2.0) / ${Math.round(Window.size.width / 2)}.0 - 1.0,
                    (vertex_rect.y + rotated_pos.y / 2.0) / ${Math.round(Window.size.height / 2)}.0 - 1.0,
                0, 1);
                texcoord = tex_coord;
            }
        `);
        const fragmentShader: WebGLShader = load_shader(gl.FRAGMENT_SHADER,`
            precision mediump float;
            varying vec2 texcoord;
            uniform sampler2D texture;
            uniform float opacity;
            void main(void){
                gl_FragColor = texture2D(texture, texcoord);
                gl_FragColor *= opacity;
            }
        `);
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(this.program)}`);
        }
        this.attributes = {
            vertex_pos: gl.getAttribLocation(this.program, "vertex_pos"),
            vertex_rect: gl.getUniformLocation(this.program, "vertex_rect"),
            rotate: gl.getUniformLocation(this.program, "rotate"),
            tex_coord: gl.getAttribLocation(this.program, "tex_coord"),
            sampler: gl.getUniformLocation(this.program, "texture"),
            opacity: gl.getUniformLocation(this.program, "opacity"),
        };
        // Vertex position buffer
        this.position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertex_array, gl.STATIC_DRAW);
        // Texture coordinate buffer
        this.coordinate_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordinate_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, coordinate_array, gl.STATIC_DRAW);
        // Clean
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }
    start(update: () => void): void {
        if(this.interval){
            this.pause();
        }
        this.interval = setInterval(() => {
            gl.clear(gl.COLOR_BUFFER_BIT);
            update();
        }, 1000.0 / Setting.FPS) // 60 fps
    }
    pause(): void {
        if(this.interval){
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    draw_texture(texture: Texture, transform: Transform = new Transform): void {
        if(texture.texture){
            gl.useProgram(this.program);
            // Vertex
            gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer);
            gl.vertexAttribPointer(this.attributes.vertex_pos, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributes.vertex_pos);
            // Vertex rect
            gl.uniform4fv(this.attributes.vertex_rect, [
                texture.offset.x + transform.offset.x,
                texture.offset.y + transform.offset.y,
                texture.size.width * transform.scale.width,
                texture.size.height * transform.scale.height,
            ]);
            // Rotate
            gl.uniform1f(this.attributes.rotate, transform.rotate);
            // Texture
            gl.bindBuffer(gl.ARRAY_BUFFER, this.coordinate_buffer);
            gl.vertexAttribPointer(this.attributes.tex_coord, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributes.tex_coord);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture.texture);
            gl.uniform1i(this.attributes.sampler, 0);
            // Opacity
            gl.uniform1f(this.attributes.opacity, transform.opacity);
            // Draw
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }
    private program: WebGLProgram;
    private position_buffer: WebGLBuffer;
    private coordinate_buffer: WebGLBuffer;
    private attributes: {
        vertex_pos: number,
        vertex_rect: WebGLUniformLocation,
        rotate: WebGLUniformLocation,
        tex_coord: number,
        sampler: WebGLUniformLocation,
        opacity: WebGLUniformLocation,
    };
    private interval: ReturnType<typeof setInterval> = null;
}

export function create_texture(image: HTMLImageElement): WebGLTexture{
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    if (is_power_of_2(image.width) && is_power_of_2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    return texture;
}

const instance = new GL();
export default instance;

function load_shader(type: number, source: string): WebGLShader{
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function is_power_of_2(value: number): boolean{
    return (value & (value - 1)) === 0;
}