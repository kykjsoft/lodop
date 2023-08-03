import { defineConfig } from 'vite'

import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  server:{
    host:"0.0.0.0"
  },
  resolve:{
    alias:{
      "@":resolve(__dirname,"src")
    }
  },
  build:{
    target:'modules',
    outDir:'dist',
    emptyOutDir:true,
    sourcemap:true,
    lib:{
      entry: './src/index.ts',
      name: 'kyadmin.lodop', 
      formats: [
        'es','umd','iife'
      ], 
      fileName: 'kyadmin-lodop',
    }
  }
})
