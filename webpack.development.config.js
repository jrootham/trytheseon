/**
 * webpack.development.config.js
 *
 * Created by jrootham on 19/12/15.
 *
 * Copyright © 2015 Jim Rootham
 */

const webpack = require("webpack");
const config = require("./webpack.config.js");

config.entry = [
    //"webpack-dev-server/client?http://localhost:8080"
    "webpack-hot-middleware/client"
    , config.entry
];

config.plugins.unshift(
    new webpack.HotModuleReplacementPlugin()
);

module.exports = config;

