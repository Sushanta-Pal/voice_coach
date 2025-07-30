import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'os'
import qrcode from 'qrcode-terminal'

function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address
      }
    }
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
  },
  configureServer() {
    const ip = getLocalIP()
    const url = `http://${ip}:5173`
    qrcode.generate(url, { small: true })
    console.log(`\n🔗  Local network: ${url}\n`)
  },
})
