var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
        './src/main.jsx'
    ],
    output: {
        path: __dirname + "/dist",
        filename: "[name].js",
        publicPath: '/dist/'
    },
    module: {
        loaders: [{
            test: /\.less$/,
            loader: ExtractTextPlugin.extract("css!less")
        }, {
            test: /\.jsx?$/,
            loaders: ['react-hot', 'babel'],
            include: path.join(__dirname, 'src')
        }]
    },
    plugins: [
        new ExtractTextPlugin("[name].css")
    ]
}