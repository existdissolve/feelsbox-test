const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const htmlPlugin = new HtmlWebPackPlugin({
    template: './src/index.html',
    filename: './index.html'
});

const manifestPlugin = new WebpackPwaManifest({
    name: 'FeelsBox Sandbox',
    short_name: 'FeelsBox Sandbox',
    description: 'Sandbox for testing Feelsbox rendering',
    background_color: '#ffffff',
    ios: true,
    icons: [{
        src: path.resolve('./feelsbox.png'),
        ios: true,
        sizes: [128, 96, 64, 32, 24, 16] // multiple sizes
    }]
});

const hotModule = new webpack.HotModuleReplacementPlugin();

module.exports = {
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        compress: true,
        contentBase: 'src',
        historyApiFallback: true,
        host: 'feelsbox-sandbox.local',
        hot: true,
        https: {
            ca: fs.readFileSync(('./cert/ca.pem')),
            cert: fs.readFileSync('./localhost.pem'),
            key: fs.readFileSync('./localhost-key.pem')
        },
        index: 'App',
        port: 8082,
        proxy: {
            '/api/**': {
                target: 'http://localhost:3000',
                secure: true
            }
        }
    },
    output: {
        pathinfo: false,
        path: path.resolve(process.cwd(), 'build'),
        publicPath: '/',
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [htmlPlugin, manifestPlugin, hotModule],
    resolve: {
        alias: {
            '-': path.join(__dirname, 'src'),
            'react-dom': '@hot-loader/react-dom'
        },
        extensions: ['.js', '.jsx']
    }
};
