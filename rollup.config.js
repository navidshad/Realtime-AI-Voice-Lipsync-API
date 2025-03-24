import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser'; // Optional: for minification
import resolve from '@rollup/plugin-node-resolve'; // Resolve node modules
import commonjs from '@rollup/plugin-commonjs'; // Convert CommonJS to ES6
import json from '@rollup/plugin-json'; // Import the JSON plugin
import dotenv from 'dotenv';
import dotenvPlugin from 'rollup-plugin-dotenv'; // Import dotenv plugin
import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import tailwindcss from '@tailwindcss/postcss';

// Load environment variables from .env file
dotenv.config();

if(!process.env.NODE_ENV){
    process.env.NODE_ENV = 'development'; // Default to development if not set
}

if(!process.env.NODE_MODE){
    process.env.NODE_MODE = 'dev'; // Default to dev if not set
}

const isProduction = process.env.NODE_ENV === 'production'; // Check if in production mode
const isStaging = !isProduction;

const isBuildMode = process.env.NODE_MODE === 'build';
const isDevMode = !isBuildMode;

process.env.ENV_EXAMPLE = isProduction ? process.env.ENV_EXAMPLE_PRODUCTION : process.env.ENV_EXAMPLE_STAGING;

export default [
    {
        input: 'src/_index.tsx',
        output: {
            file: `dist/bundle${isStaging ? '.staging' : ''}.js`,
            format: 'iife',
            name: 'Apika',
            sourcemap: false,
        },
        external: ['dotenv'],
        plugins: [
            del({ targets: 'dist/*' }),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'process.env.NODE_MODE': JSON.stringify(process.env.NODE_MODE),
                'process.env.GET_SESSION_DATA_URL': JSON.stringify(process.env.GET_SESSION_DATA_URL)
            }),
            dotenvPlugin(),
            json(),
            resolve(),
            commonjs(),
            isDevMode && serve({
                open: true,
                contentBase: ['public', 'dist'],
                port: 3000,
            }),
            isBuildMode && terser(),
            typescript({
                tsconfig: './tsconfig.json'
            }),
            postcss({
                plugins: [
                    tailwindcss(),
                ],
                extract: false
            })
        ].filter(Boolean),
    },
    // {
    //     input: 'src/style/pricing-popup.scss',
    //     output: {
    //         file: `dist/pricing-popup${isStaging ? '.staging' : ''}.css`,
    //     },
    //     plugins: [
    //         del({ targets: ['dist/*.css', 'dist/*.css.map', ] }),
    //         postcss({
    //             extract: true,
    //             use: ['sass'],
    //             minimize: isBuildMode,
    //             sourceMap: true,
    //         }),
    //     ],
    // },
];
