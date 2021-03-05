const postcss       = require('rollup-plugin-postcss');
const scss          = require('rollup-plugin-scss');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const commonjs      = require('@rollup/plugin-commonjs');
const internal      = require('rollup-plugin-internal').default;
console.log('Boon')
module.exports = {
    rollup(config, options) {
        config.external = false;
        config.plugins.push(
            [
                scss({

                     }),
                postcss({
                            include: [/node_modules.monaco/],
                            use:     ['sass'],
                            modules: true,
                            extract: false,
                            inject:  true
                        }),
                nodeResolve(),
                commonjs(),
            ]
        );
        return config;
    }
}
