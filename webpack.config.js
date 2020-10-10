const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    resolve: {
        modules: ['./src', './node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: "./index.html"
        }),
        new CopyWebpackPlugin([
            {from: './wasm/autotraceCpp.wasm', to: './wasm/autotraceCpp.wasm'},
        ])
    ],
    // Needed for wasm.js file.
    // https://github.com/webpack-contrib/css-loader/issues/447
    node: {
        fs: 'empty'
    },
};
