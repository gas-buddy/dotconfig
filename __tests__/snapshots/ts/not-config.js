/**
 * This file is generated by dotconfig. Do not edit it directly.
 * Instead, edit the dotconfig.js or dotconfig.ts file in your project root.
 *
 * See https://github.com/gas-buddy/dotconfig for more information.
 * @version dotconfig@0.1.0
 */

require('ts-node').register();
const config = require('./dotconfig').default['not-config'].configuration;
module.exports = typeof config === 'function' ? config() : config;
