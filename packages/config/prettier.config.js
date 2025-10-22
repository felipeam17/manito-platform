/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: "avoid",
  printWidth: 100,
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "es5",
  tabWidth: 2,
  useTabs: false,
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
};
