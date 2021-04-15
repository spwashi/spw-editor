const path                 = require('path');
const webpack              = require("webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const modeOptions = {development: 'development', production: 'production'};


const include = [/node_modules/];
const mode    = modeOptions.production;
const isProd  = mode === 'production';

module.exports = {
    entry: './src/index.tsx',
    mode:  'production',
    module:
           {
               rules: [
                   {
                       test:    /\.tsx?$/,
                       use:     'ts-loader',
                       exclude: /node_modules/,
                   },
                   {
                       test: /\.s?css$/,
                       use:  ['style-loader', 'css-loader', 'sass-loader'],
                       include,
                   },
                   {
                       test: /\.ttf$/,
                       use:  [
                           {
                               loader:  'file-loader',
                               options: {
                                   name: './font/[hash].[ext]',
                               },
                           },
                       ],
                       include
                   }
               ],
           },
    resolve:
           {
               extensions: ['.tsx', '.ts', '.js'],
               fallback:   {},
               alias:      {react: path.resolve('./node_modules/react')},
           },
    output:
           {
               filename:   'main.js',
               publicPath: "/",
               path:       path.resolve(__dirname, 'out'),
           },
    plugins:
           [
               isProd && new BundleAnalyzerPlugin(),
               isProd && new CleanWebpackPlugin(),
           ]
               .filter(i => !!i),
};