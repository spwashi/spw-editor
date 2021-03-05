const path = require('path');


module.exports = {
    stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
    addons:  ['@storybook/addon-edges', '@storybook/addon-essentials', '@storybook/preset-scss'],
    // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
    typescript:   {
        check: true, // type-check stories during Storybook build
    },
    webpackFinal: async (config, {configType}) => {
        const include = [path.resolve(__dirname, '../'), /node_modules.monaco/];
        config.module.rules.push({
                                     test:    /\.s?css$/,
                                     use:     ['style-loader', 'css-loader', 'sass-loader'],
                                     include: include,
                                 });
        config.module.rules.push({
                                     test: /\.ttf$/,
                                     use:  [
                                         {
                                             loader:  'ttf-loader',
                                             options: {name: './font/[hash].[ext]',},
                                         },
                                     ],
                                     include
                                 });
        return config;
    },
};
