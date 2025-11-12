import { defineConfig } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import svgr from "vite-plugin-svgr";
import postcssPresetEnv from "postcss-preset-env";
import cssnanoPlugin from "cssnano";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                icon: true
            }
        }),
        electron({
            main: {
                // Shortcut of `build.lib.entry`.
                entry: 'src/main/main.ts',
            },
            preload: {
                // Shortcut of `build.rollupOptions.input`.
                // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
                input: path.join(__dirname, 'src/preload/preload.ts'),
                vite: {
                    build: {
                        rollupOptions: {
                            output: {
                                format: 'es',
                                entryFileNames: '[name].js'
                            }
                        }
                    }
                }
            },
            // Ployfill the Electron and Node.js API for Renderer process.
            // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
            // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
            renderer: process.env.NODE_ENV === 'test'
                // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
                ? void 0
                : {},
        }),
    ],
    css: {
        postcss: {
            plugins: [
                postcssPresetEnv({
                    stage: 1,
                    features: {
                        // Disable CSS nesting syntax and variable control. Similar usage exists in Sass.
                        'nesting-rules': false,
                        'custom-properties': false
                    },
                    autoprefixer: {
                        overrideBrowserslist: [
                            'last 2 versions',
                            '> 1%',
                            'not dead',
                            'Electron >= 20'
                        ],
                        grid: 'autoplace',
                        flexbox: 'no-2009'
                    }
                }),
                cssnanoPlugin({
                    // Default compression strategy.
                    preset: 'default'
                })
            ]
        }
    },
    resolve: {
        // Path Alias
        alias: {
            '@': resolve(__dirname, './src'),
            '@renderer': resolve(__dirname, './src/renderer'),
            '@assets': resolve(__dirname, './src/renderer/assets'),
            '@ui': resolve(__dirname, './src/renderer/components/ui'),
            '@layout': resolve(__dirname, './src/renderer/components/layout'),
            '@styles': resolve(__dirname, './src/renderer/assets/styles'),
            '@utils': resolve(__dirname, './src/utils')
        }
    },
    define: {
        'import.meta.env.VITE_APP_NAME': JSON.stringify(process.env.npm_package_name),
        'import.meta.env.VITE_APP_PRODUCT_NAME': JSON.stringify(process.env.npm_package_productName),
        'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version)
    }
});
