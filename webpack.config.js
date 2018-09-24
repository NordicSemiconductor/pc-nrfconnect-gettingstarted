
var config = require('./node_modules/pc-nrfconnect-devdep/config/webpack.config.js');

config.resolve.extensions.push('.mjs');
config.module.rules[0].test = /\.(js|jsx|mjs)$/

module.exports = config;

console.log('webpack config: ', config);
