module.exports = {
  env: {
    node: true,
    mocha: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    eqeqeq: ["error", "always", { null: "ignore" }],
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
