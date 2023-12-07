const path = require('path');

module.exports = {
    devtool: 'eval-source-map',
    mode: "development",
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        // open: true, // Open the default browser when server starts
        hot: true, // Enable hot module replacement
    },
    module: {
        rules: [
        // Add your loaders here
        ],
    },
    // Add other configurations as needed
};
