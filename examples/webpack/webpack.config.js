const keysTransformer = require('../../transformer').default;

module.exports = ['ts-loader', 'awesome-typescript-loader'].map(loader => ({
  mode: 'development',
  entry: './index.ts',
  output: {
    filename: `${loader}.js`,
    path: __dirname
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader,
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
}));
