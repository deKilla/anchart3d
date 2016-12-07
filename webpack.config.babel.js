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
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};