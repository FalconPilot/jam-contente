import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
export const viteConfig = (userConfig: UserConfig = {}) => defineConfig({
  base: './',
  plugins: [react()],
  ...userConfig,
})
