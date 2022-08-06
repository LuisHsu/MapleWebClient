import Texture from "./Texture";

const gl = (document.getElementById("screen") as HTMLCanvasElement).getContext("webgl");
const vertex_array = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);
const coordinate_array = new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]);

class GL {
    init(): void {
        // Clear color
        gl.clearColor(0, 0, 0, 1);

        // Shaders
        const vertexShader: WebGLShader = load_shader(gl.VERTEX_SHADER,`
            attribute vec4 vertex_rect;
            attribute vec2 tex_coord;
            varying vec2 texcoord;
            void main(void){
                gl_Position = vertex_rect;
                texcoord = tex_coord;
            }
        `);
        const fragmentShader: WebGLShader = load_shader(gl.FRAGMENT_SHADER,`
            precision mediump float;
            varying vec2 texcoord;
            uniform sampler2D texture;
            void main(void){
                gl_FragColor = texture2D(texture, texcoord);
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
            vertex_rect: gl.getAttribLocation(this.program, "vertex_rect"),
            tex_coord: gl.getAttribLocation(this.program, "tex_coord"),
            sampler: gl.getUniformLocation(this.program, "texture"),
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
        }, 60.0 / 1000.0) // 60 fps
    }
    pause(): void {
        if(this.interval){
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    draw_texture(texture: Texture): void {
        if(texture.texture){
            gl.useProgram(this.program);
            // Vertex
            gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer);
            gl.vertexAttribPointer(this.attributes.vertex_rect, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributes.vertex_rect);
            // Texture
            gl.bindBuffer(gl.ARRAY_BUFFER, this.coordinate_buffer);
            gl.vertexAttribPointer(this.attributes.tex_coord, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributes.tex_coord);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture.texture);
            gl.uniform1i(this.attributes.sampler, 0);
            // Draw
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }
    private program: WebGLProgram;
    private position_buffer: WebGLBuffer;
    private coordinate_buffer: WebGLBuffer;
    private attributes: {
        vertex_rect: number,
        tex_coord: number,
        sampler: WebGLUniformLocation,
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