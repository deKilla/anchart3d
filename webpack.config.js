module.exports = {

  entry: './src/utils/createChart.js',
  output: {
    filename: 'build/anchart3d.js',
      libraryTarget: 'var',
      library: 'anchart3d'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
          //Thanks to this answer, was able to bundle tween.js: http://stackoverflow.com/a/36987685/4809932
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};