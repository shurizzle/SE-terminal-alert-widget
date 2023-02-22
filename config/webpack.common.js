const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const paths = require("./paths");

module.exports = {
  // Where webpack looks to start building the bundle
  entry: [paths.src + "/main.ts", paths.src + "/style.css"],

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: "[name].bundle.js",
    publicPath: "/",
  },

  // Customize the webpack build process
  plugins: [new MiniCssExtractPlugin(), new CleanWebpackPlugin()],

  // Determine how modules within the project are treated
  module: {
    rules: [{ test: /\.[tj]s$/, use: "ts-loader", exclude: /node_modules/ }],
  },

  resolve: {
    modules: [paths.src, "node_modules"],
    extensions: [".js", ".ts"],
    alias: {
      "@": paths.src,
    },
  },
};
