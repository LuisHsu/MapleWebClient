const Express = require("express");
const Webpack = require("webpack");
const WebpackDevMiddleware = require("webpack-dev-middleware");
const Path = require("path");

const app = Express();
const config = require("../webpack.config")(process.env);
const compiler = Webpack(config);

app.use(WebpackDevMiddleware(compiler, {publicPath: config.output.publicPath}));
app.use(Express.static(Path.resolve(__dirname, "..", "dist")));

app.listen(8080)