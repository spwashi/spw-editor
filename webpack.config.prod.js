const path                 = require('path');
const HtmlWebpackPlugin    = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MonacoWebpackPlugin  = require('monaco-editor-webpack-plugin');
const webpack              = require("webpack");

const doAnalyze = false;
const plugins   = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({template: path.resolve(__dirname, 'src/assets/index.html')}),
    doAnalyze && new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
                                 'process.env.SPW_SERVER_URL': JSON.stringify('https://backend.spw.spwashi.com'),
                                 'process.env.NODE_ENV':       JSON.stringify('production'),
                                 'process.env.DEBUG':          JSON.stringify(false),
                             }),
    new MonacoWebpackPlugin({languages: ["php"],})
].filter(Boolean);
module.exports  =
    (config) => Object.assign(require('./webpack.config')(config),
                              {
                                  entry:        {main: './src/render.tsx'},
                                  mode:         'production',
                                  devtool:      undefined,
                                  devServer:    undefined,
                                  optimization: {
                                      runtimeChunk: 'single',
                                      splitChunks:  {
                                          chunks:             'all',
                                          maxInitialRequests: Infinity,
                                          minSize:            0,
                                          cacheGroups:        {
                                              reactVendor:                 {
                                                  test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                                                  name: "bundle.npm.react-vendor"
                                              },
                                              monacoRoot:                  {
                                                  test: /[\\/]node_modules[\\/]monaco-editor[\\/](?!esm[\\/]vs[\\/](language|basic-languages)[\\/]).*/,
                                                  name: "npm.monaco.root"
                                              },
                                              monacoLanguage:              {
                                                  test: /[\\/]node_modules[\\/]monaco-editor[\\/]esm[\\/]vs[\\/]language[\\/]/,
                                                  name: "npm.monaco.language"
                                              },
                                              monacoBasicLanguage:         {
                                                  test: /[\\/]node_modules[\\/]monaco-editor[\\/]esm[\\/]vs[\\/]basic-languages[\\/]/,
                                                  name: "npm.monaco.basic-languages"
                                              },
                                              monacoVim_monacoEditorReact: {
                                                  test: /[\\/]node_modules[\\/](monaco-vim|@monaco-editor)[\\/]/,
                                                  name: "bundle.npm.monaco-editor"
                                              },
                                              vendor:                      {
                                                  test: /[\\/]node_modules[\\/](?!(monaco-editor|@monaco-editor|monaco-vim|react|react-dom)[\\/]).*/,
                                                  name(module) {
                                                      // get the name. E.g. node_modules/packageName/not/this/part.js
                                                      // or node_modules/packageName
                                                      const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                                                      // npm package names are URL-safe, but some servers don't like @ symbols
                                                      return `npm.${packageName.replace('@', '')}`;
                                                  },
                                              }
                                          },
                                      },
                                  },
                                  plugins
                              })