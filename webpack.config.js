/**
 * webpack.config.js
 *
 * Created by jrootham on 21/12/15.
 *
 * Copyright © 2015 Jim Rootham
 */
var webpack = require("webpack");

module.exports = {
    entry: "./contents.js"
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
        ]
    }
    , plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(true)
    ]
}