const path = require("path");

/**
 * Most of this setup is directly from Webpack documentation
 * @see https://webpack.js.org/guides/typescript/
 */
module.exports = {
    mode: process.env.NODE_ENV ?? "development",
    entry: "./src/entrypoint.tsx",
    module: {
        rules: [
            /**
             * TS/TSX Loader
             *
             * This will load our React component files
             */
            {
                test: /.tsx?$/,

                /** This uses tsc (TypeScript compiler) under the hood, and reads tsconfig.json for config */
                use: "ts-loader",

                exclude: /node_modules/,
            },

            /**
             * CSS Loader
             *
             * This will load our per-component CSS files
             */
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
};
