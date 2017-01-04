/**
 * webpack.production.config.js.js
 *
 * Created by jrootham on 23/06/16.
 *
 * Copyright © 2016 Jim Rootham
 */
var webpack = require("webpack");
var config = require("./webpack.config.js");


delete config.devtool;

module.exports = config;
