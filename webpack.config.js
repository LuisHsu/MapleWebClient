const Path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
    var config = {
        entry: './src/index.js',
        output: {
            filename: 'index.js',
            path: Path.resolve(__dirname, 'dist'),
            clean: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Maplestory Web Client',
                template: './src/index.ejs'
            }),
        ]
    };
    if(env.DEBUG){
        config.mode = 'development';
        config.devtool = 'inline-source-map';
        config.devServer = {
            static: './dist',
            client: {
                progress: true,
                reconnect: true,
            },
        };
    }else{
        config.mode = 'production';
        config.optimization = {
            minimize: true,
            minimizer: [new TerserPlugin()],
            splitChunks: {
                chunks: 'all',
            },
        };
    }
    return config;
};