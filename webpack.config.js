const path                 = require('path');
const HtmlWebpackPlugin    = require("html-webpack-plugin");
const webpack              = require("webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MonacoWebpackPlugin  = require('monaco-editor-webpack-plugin');

const modeOptions = {development: 'development', production: 'production'};


const include = [/node_modules/];
const mode    = process.env.NODE_ENV || modeOptions.development;
const isProd  = mode === 'production';

module.exports =
    (config) => {
        return {
            entry:   ['react-hot-loader/patch', './src/render.tsx'],
            mode:    mode,
            devtool: !isProd ? 'inline-source-map' : undefined,
            devServer:
                     {
                         hot:                true,
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
                         fallback:   {},
                         alias:
                                     {
                                         'react-dom': '@hot-loader/react-dom',
                                         react:       path.resolve('./node_modules/react'),
                                         process:     "process/browser",
                                     },
                     },
            output:
                     {
                         publicPath:        "/",
                         filename:          '[name].[chunkhash:8].js',
                         sourceMapFilename: '[name].[chunkhash:8].map',
                         chunkFilename:     '[name].[chunkhash:8].js',
                         path:              path.resolve(__dirname, 'out'),
                     },
            plugins:
                     [
                         new HtmlWebpackPlugin({template: path.resolve(__dirname, 'src/assets/index.html')}),
                         new webpack.HotModuleReplacementPlugin(),
                         isProd && new BundleAnalyzerPlugin(),
                         isProd && new CleanWebpackPlugin(),
                         new webpack.DefinePlugin({
                                                      'process.env.SPW_SERVER_URL': JSON.stringify('http://localhost:8000'),
                                                      'process.env.NODE_ENV':       JSON.stringify(mode),
                                                      'process.env.DEBUG':          JSON.stringify(process.env.DEBUG || false),
                                                  }),
                         new MonacoWebpackPlugin({languages: ['spw'],})
                     ]
                         .filter(i => !!i),
        }
    };