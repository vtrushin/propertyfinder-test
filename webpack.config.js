const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = (env, argv) => {
	const devMode = argv.mode !== 'production';

	return {
		entry: './src/index.js',
		output: {
			path: __dirname,
			filename: 'bundle.js'
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: 'babel-loader'
				},
				{
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								modules: true,
								localIdentName: devMode ? '[hash:base64:5]--[path][name]__[local]' : '[hash:base64]'
							}
						}
					]
				},
				{
					test: /\.svg$/,
					loader: 'url-loader'
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin({ filename: 'main.css' }),
			new WebpackNotifierPlugin()
		]
	}
};
