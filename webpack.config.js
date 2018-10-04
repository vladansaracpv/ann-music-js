const path = require('path');

module.exports = {
    entry: path.join(__dirname, '/src/app.ts'),
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'build'),
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
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
};
