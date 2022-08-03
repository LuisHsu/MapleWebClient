const Path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
    var config = {
        entry: './src/index.ts',
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
                favicon: './asset/icon.ico',
            }),
            new CopyPlugin({
                patterns: [
                    Path.resolve(__dirname, 'asset', "*"),
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
            static: './data',
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