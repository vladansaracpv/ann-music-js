const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js',
        publicPath: 'http://localhost:3000/dist/',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    devServer: {
        openPage: '/dist',
        hot: true,
        inline: false,
        port: 3000
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
};
