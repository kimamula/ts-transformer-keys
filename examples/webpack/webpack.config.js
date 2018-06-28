const keysTransformer = require('ts-transformer-keys/transformer').default;

module.exports = {
  mode: 'development',
  entry: './index.ts',
  output: {
    filename: 'index.js',
    path: __dirname
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        options: {
          getCustomTransformers: program => ({
              before: [
                  keysTransformer(program)
              ]
          })
        }
      }
    ]
  }
};
