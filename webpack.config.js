const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
	mode: 'production',
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
					// 'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: true
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
};
