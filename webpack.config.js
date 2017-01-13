var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: './build',
    filename: 'anchart3d.js',
    libraryTarget: 'var',
    library: 'anchart3d'
  },
  module: {
    loaders: [
      {
        test: /(\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
      }
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 8080,
      server: { baseDir: ['public'] },
      files: ['./build/*','./public/css/styles.css'],
      serveStatic: [{
        route: 'build',
        dir: 'build'
      }]
    })
  ]
};