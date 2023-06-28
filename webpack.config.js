const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const IS_DEV = process.env.NODE_ENV !== 'production'
const IS_UXP = process.env.TYPE === 'uxp'

module.exports = {
	entry: `./src/index_${IS_UXP ? 'uxp' : 'cep'}.ts`,
	mode: IS_DEV ? 'development' : 'production',
	target: 'node',
	devtool: IS_DEV ? 'eval-cheap-source-map' : false,
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: (loader) => [
									require('postcss-import')({
										root: loader.resourcePath,
									}),
									require('postcss-preset-env')({
										browsers: 'last 2 versions',
									}),
									...(IS_DEV ? [] : [require('cssnano')()]),
								],
							},
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	externals: {
		photoshop: 'commonjs2 photoshop',
		uxp: 'commonjs2 uxp',
		os: 'commonjs2 os',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].bundle.css',
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/index.ejs',
			scriptLoading: 'defer',
			minify: false,
			inject: false,
			// Custom variable to be used in template
			isCEP: !IS_UXP,
			isUXP: IS_UXP,
		}),
		new CopyPlugin({
			patterns: [
				{
					from: './plugin',
					globOptions: {
						ignore: IS_DEV ? [] : ['**/.debug'],
					},
				},
			],
		}),
	],
	watchOptions: {
		ignored: ['dist', 'node_modules'],
	},
}
