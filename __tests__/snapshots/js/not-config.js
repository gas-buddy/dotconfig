/**
 * This file is generated by coconfig. Do not edit it directly.
 * Instead, edit the coconfig.js or coconfig.ts file in your project root.
 *
 * See https://github.com/gas-buddy/coconfig for more information.
 * @version coconfig@0.8.0
 */
const configModule = require('./coconfig');

const { configuration } = configModule['not-config'] || (configModule.default && configModule.default['not-config']);
const resolved = typeof configuration === 'function' ? configuration() : configuration;

module.exports = config;
