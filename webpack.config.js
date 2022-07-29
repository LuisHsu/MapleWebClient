const Path = require("path");

module.exports = (env, argv) => ({
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: Path.resolve(__dirname, 'dist'),
    },
    mode: env.DEBUG ? 'development' :  'production'
});