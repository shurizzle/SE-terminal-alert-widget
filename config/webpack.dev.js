const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const common = require("./webpack.common");
const paths = require("./paths");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",

  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack Boilerplate",
      template: paths.config + "/index.html",
      filename: "index.html",
    }),
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },

  devServer: {
    watchFiles: [paths.config + "/index.html", paths.src + "/**/*.html"],
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
});
