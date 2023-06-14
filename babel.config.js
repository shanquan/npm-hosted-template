module.exports = {
  "presets": [
    // "@babel/env" // for vite
    "@vue/app", // for webpack
    // "es2015"
  ],
  "plugins": [
    "@babel/plugin-transform-regenerator", // async/await
    "@babel/plugin-proposal-optional-chaining",// .?
    "@babel/plugin-proposal-nullish-coalescing-operator"// ??
  ]
}