const path                 = require('path');
const HtmlWebpackPlugin    = require("html-webpack-plugin");
const webpack              = require("webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const modeOptions = {development: 'development', production: 'production'};


const include = [/node_modules/];
const mode    = modeOptions.development;
const isProd  = mode === 'production';

module.exports = {
    entry:   './src/App.tsx',
    mode:    mode,
    devtool: !isProd ? 'inline-source-map' : undefined,
    devServer:
             {
                 contentBase:        './out',
                 port:               6006,
                 historyApiFallback: true,
             },
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
                 fallback:   {
                     crypto: require.resolve('crypto-browserify'),
                     stream: require.resolve('stream-browserify'),
                 },
                 alias:
                             {
                                 process: "process/browser",
                                 react:   path.resolve('./node_modules/react')
                             },
             },
    output:
             {
                 filename:   'main.js',
                 publicPath: "/",
                 path:       path.resolve(__dirname, 'out'),
             },
    plugins:
             [
                 new HtmlWebpackPlugin({template: path.resolve(__dirname, 'src/assets/index.html')}),
                 new webpack.ProvidePlugin({process: 'process/browser',}),
                 isProd && new BundleAnalyzerPlugin(),
                 isProd && new CleanWebpackPlugin(),
             ]
                 .filter(i => !!i),
};