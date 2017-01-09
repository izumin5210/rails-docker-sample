import webpack            from 'webpack'
import ExtractTextPlugin  from 'extract-text-webpack-plugin'
import ManifestPlugin     from 'webpack-manifest-plugin'
import path               from 'path'

const env = process.env.NODE_ENV || 'development'
const isDevelopment = env === 'development'

const filename = isDevelopment ? '[name]' : '[name]-[hash]'

const styleExtractor = new ExtractTextPlugin({ filename: `${filename}.css`, allChunks: true, disable: false });

const config = {
  devtool: 'inline-source-map',

  entry: {
    index: './src/index',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          { loader: 'babel-loader' },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: styleExtractor.extract({
          loader: [
            "css-loader",
            "postcss-loader",
          ],
        }),
      },
    ],
  },

  output: {
    filename: `${filename}.js`,
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      test: /\.css$/,
      options: {
        postcss: bundle => [
          require("postcss-smart-import")({
            addDependencyTo: bundle,
          }),
          require('postcss-custom-properties'),
        ],
        context: __dirname,
      },
    }),

    styleExtractor,

    new ManifestPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': env
    }),

    ...(isDevelopment ? ([
      new webpack.NoErrorsPlugin(),
    ]) : ([
      new webpack.LoaderOptionsPlugin({ minimize: false, debug: false }),

      new webpack.optimize.DedupePlugin(),

      new webpack.optimize.OccurrenceOrderPlugin(),

      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          screw_ie8: true,
          warnings: false
        },
      }),
    ])),
  ],

  externals: [
  ],

  target: 'web',
};

export default config;