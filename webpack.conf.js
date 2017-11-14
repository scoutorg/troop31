import webpack from "webpack";
import path from "path";
import ManifestPlugin from "webpack-manifest-plugin";

export default {
  entry: {
    app: ["./js/app"],
    cms: ["./js/cms"]
  },

  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name]-[chunkhash].js"
  },

  externals: [/^vendor\/.+\.js$/],

  module: {
    loaders: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file?name=/[hash].[ext]"
      }, {
        test: /\.json$/, loader: "json-loader"
      }, {
        loader: "babel-loader",
        test: /\.js?$/,
        exclude: /node_modules/,
        query: {cacheDirectory: true}
      }
    ]
  },

  plugins: [
    new ManifestPlugin({
      fileName: "../site/data/manifest.json"
    }),
    new webpack.ProvidePlugin({
      "fetch": "imports?this=>global!exports?global.fetch!whatwg-fetch"
    })
  ],

  context: path.join(__dirname, "src")
};
