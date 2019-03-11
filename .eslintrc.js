module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  globals: {
    PIXI: false,
  },
  rules: {
    indent: ["error", 2, { SwitchCase: 1 }],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-console": "off",
    "no-undef": "error",
    "no-unused-vars": ["error", { args: "none" }],
    "multiline-ternary": ["error", "always-multiline"],
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    curly: ["warn", "all"],
    "eol-last": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "max-len": ["error", { code: 100, tabWidth: 2, ignoreTrailingComments: true }],
    "no-trailing-spaces": ["error"],
    "object-curly-spacing": ["warn", "always", { objectsInObjects: false, arraysInObjects: false }],
    "arrow-parens": ["warn", "as-needed"],
  },
};
