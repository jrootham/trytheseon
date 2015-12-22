/**
 * devServer.js
 *
 * Created by jrootham on 19/12/15.
 *
 * Copyright © 2015 Jim Rootham
 */
import path from "path";
import express from "express";
import webpack from "webpack";
import config from "./webpack.development.config.js";

const app = express();
const compiler = webpack(config);

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true
    , publicPath: config.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(1447, "localhost", function(err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Listening at http://localhost:1447");
});
