import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    base: '/Hexscholl-JSLive-Final/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                nested: resolve(__dirname, 'admin.html')
            }
        }
    }
})