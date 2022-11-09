const Express = require("express");
const Webpack = require("webpack");
const WebpackDevMiddleware = require("webpack-dev-middleware");
const Path = require("path");
const Session = require("./session");

const app = Express();
const _ = require("express-ws")(app);
const config = require("../webpack.config")(process.env);
const compiler = Webpack(config);

app.use(WebpackDevMiddleware(compiler, {publicPath: config.output.publicPath}));
app.use(require("webpack-hot-middleware")(compiler));
app.use(Express.static(Path.resolve(__dirname, "..", "dist")));

app.ws("/api", ws => {
    Session(ws);
})

app.listen(8484)