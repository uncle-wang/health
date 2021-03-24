const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';

const options = {
    mode: PRODUCTION ? 'production' : 'development',
    entry: path.resolve(__dirname, './src/main'),
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: 'main.[contenthash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime'],
                    }
                }
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.(png|jpg|gif|woff|svg|eot|ttf)/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024
                    }
                }
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'main.[contenthash:8].css',
        }),
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },
};

if (PRODUCTION) {
    options.devServer = {
        hot: true,
        host: '0.0.0.0',
        contentBase: path.resolve(__dirname, './dist'),
    };
}

module.exports = options;