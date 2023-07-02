const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')

const IS_DEV = process.env.NODE_ENV !== 'production'
const IS_UXP = process.env.TYPE === 'uxp'

console.log(IS_DEV ? 'DEVELOPMENT BUILD' : 'PRODUCTION BUILD')
console.log(`BUILDING ${IS_UXP ? 'UXP PLUGIN' : 'CEP EXTENSION'}`)

const config = {
	entry: `./src/index_${IS_UXP ? 'uxp' : 'cep'}.ts`,
	mode: IS_DEV ? 'development' : 'production',
	target: 'node',
	devtool: false,
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

//* Additional steps for production build
if (!IS_DEV) {
	config.optimization = {
		moduleIds: 'named',
		minimize: true,
		minimizer: [
			// Make code smaller but keep it somehow readable since it is open-source.
			// So it will be easier to debug production builds.
			new TerserPlugin({
				extractComments: true,
				parallel: true,
				terserOptions: {
					mangle: false,
					compress: {
						conditionals: false,
						drop_console: true,
						drop_debugger: true,
						comparisons: false,
						collapse_vars: false,
						booleans: false,
						inline: false,
						keep_classnames: true,
					},
				},
			}),
		],
	}

	//* Pack plugin automatically in ./release folder
	config.plugins.push(
		new ZipPlugin({
			path: '../release',
			pathPrefix: 'wakatime-adobe',
			filename: `wakatime-adobe-${IS_UXP ? 'uxp' : 'cep'}`,
			extension: 'zip',
		})
	)
}

module.exports = config
