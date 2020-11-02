const path = require('path');


module.exports = {
    stories:      ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
    addons:       ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/preset-scss'],
    // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
    typescript:   {
        check: true, // type-check stories during Storybook build
    },
    webpackFinal: async (config, {configType}) => {
        config.module.rules.push({
                                     test:    /\.s?css$/,
                                     use:     ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
                                     include: path.resolve(__dirname, '../'),
                                 });
        return config;
    },
};
