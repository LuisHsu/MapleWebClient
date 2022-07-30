const Path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
    var config = {
        entry: './src/index.ts',
        output: {
            filename: 'index.js',
            path: Path.resolve(__dirname, 'dist'),
            clean: true,
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
                favicon: './asset/Icon.ico',
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