# coconfig

![main CI](https://github.com/gas-buddy/coconfig/actions/workflows/nodejs.yml/badge.svg)

[![npm version](https://badge.fury.io/js/@gasbuddy%2Fcoconfig.svg)](https://badge.fury.io/js/@gasbuddy%2Fcoconfig)

Centralize your per-package rc, dotfile and config files into one extensible config file.

While working on a rewrite of our Node-8-era Javascript/React/Node/Babel/Tap infrastructure, I was a little taken aback by the number of "dotfiles" in my new Typescript/Jest/Prettier happyland. I had the following:

```
.eslintignore
.eslintrc.js
.npmignore
.prettierrc.js
.yarnrc.yml
jest.config.js
next-env.d.ts
next.config.js
tsconfig.build.json
tsconfig.json
```

10 files, not including .gitignore and package.json! And more importantly, 10 files that are the exact same across all our projects. And thus after some back and forth with @jasisk, coconfig was born. The format resembles most of those config files, with the idea of extension of other base configurations at the center, and using Javascript (or Typescript) and not json so you can write real code when necessary (and as some of the above configs require).

coconfig is intended to be a very lightweight module with minimal dependencies since it likely has to run with `npx` and/or `yarn dlx` and should thus be fast to download and run.

# Installation

In package.json

```diff
 "scripts": {
+  "postinstall": "npx coconfig"
 }
```

Or for yarn:

```diff
 "scripts": {
+  "postinstall": "yarn dlx coconfig"
 }
```

coconfig will look in one of two places - coconfig.js in your package root, or in the `config` settings in your package.json as a property named `coconfig`. For example:

```
{
  "name": "my-cool-package",
  "version": "90.2.10",
  "config": {
    "coconfig": "config/my-cool-package.config.js"
  }
}
```

# coconfig.js structure
A coconfig file consists of a set of config file specifications exported as a map of key names to specs. The key names are meant to provide a way to merge configurations from multiple levels of coconfigs (typically via a package reference). See [types/index.ts](src/types/index.ts) for the full specification for the coconfig file. A configuration file specification has a filename property that can be a string or a function, and content *or* a function that will return configuration. The function is called *at runtime* - all coconfig does is make a file that requires
your coconfig and calls the function.

# Simple example
The following coconfig.js file will create an .eslintrc.js, .eslintignore, and .prettierrc.js:

```
module.exports = {
  '.eslintignore': {
    content: `build/
coverage
jest.config.js
.eslintrc.js
src/generated`,
  },
  '.eslintrc.js': {
    configuration: () => ({
      root: true,
      extends: 'gasbuddy',
      parserOptions: {
        project: './tsconfig.json'
      },
    }),
  },
  '.prettierrc.js': {
    configuration: () => ({
      bracketSpacing: true,
      bracketSameLine: true,
      singleQuote: true,
      trailingComma: 'all',
      // A person has his limits, and 80 is not it.
      printWidth: 100,
      overrides: [
        {
          files: '*.js',
          options: {
            parser: 'babel',
          },
        },
      ],
    }),
  },
}
```