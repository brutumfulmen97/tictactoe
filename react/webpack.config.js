const path = require("path");

module.exports = {
    mode: process.env.MODE_ENV ?? "development",
    entry: "./src/entrypoint.jsx",
    module: {
        rules: [
            {
                test: /.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                [
                                    "@babel/preset-react",
                                    { runtime: "automatic" },
                                ],
                            ],
                        },
                    },
                ],
            },
        ],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public"),
    },
};
