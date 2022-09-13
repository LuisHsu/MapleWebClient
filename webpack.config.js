const Path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
    var config = {
        entry: ['./src/index.ts'],
        output: {
            filename: 'index.js',
            path: Path.resolve(__dirname, 'dist'),
            clean: true,
            publicPath: '/',
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Maplestory Web Client',
                template: './src/index.ejs',
                favicon: './src/icon.ico',
                templateParameters: {
                    screenSize: {width: 1024, height: 768},
                }
            }),
            new CopyPlugin({
                patterns: [
                    Path.resolve(__dirname, 'src', "icon.ico"),
                    Path.resolve(__dirname, 'src', "play.svg"),
                ],
            }),
        ],
        resolve: {
            extensions: ['.ts', '.js', '.json']
        }
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
        config.entry.push("webpack-hot-middleware/client?path=/__webpack_hmr&reload=true")
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
        config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
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