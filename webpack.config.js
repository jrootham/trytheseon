/**
 * webpack.config.js
 *
 * Created by jrootham on 21/12/15.
 *
 * Copyright © 2015 Jim Rootham
 */
const webpack = require("webpack");

module.exports = {
    entry: "./client/index.js"
    , output: {
        path: __dirname + "/build"
        , publicPath: "/assets/"
        , filename: "bundle.js"
    }
    , devtool: "source-map"
    , resolve: {
        extensions: [
            ""
            , ".js"
        ]
    }
    , module: {
        loaders: [
            {
                test: /\.js$/
                , exclude: /node_modules/
                , loader: "babel-loader"
            }
            , {
                test: /\.json$/
                , loader: "json-loader"
            }
            , {
                test: /\.css$/
                , loader: "style-loader!css-loader"
            }
            , {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/
                , loader: "url?limit=102400"
            }
            , {
                test: /\.(jpe?g|png)(\?v=\d+\.\d+\.\d+)?$/
                , loader: "url?limit=102400"
            }
            , {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            }
        ]
    }
    , plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(true)
    ]
}