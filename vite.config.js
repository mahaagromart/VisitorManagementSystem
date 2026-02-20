// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// import { VitePWA } from "vite-plugin-pwa";
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     VitePWA({
//       registerType: "autoUpdate",
//       manifest: {
//         name: "Visitor Approval System",
//         short_name: "VisitorApp",
//         description: "Company Visitor Management",
//         theme_color: "#1677ff",
//         background_color: "#ffffff",
//         display: "standalone",
//         start_url: "/",
//         icons: [
//           {
//             src: "/icon-192.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "/icon-512.png",
//             sizes: "512x512",
//             type: "image/png",
//             purpose: "any maskable",
//           },
//         ],
//       },
//     }),
//   ],
// });


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'

// export default defineConfig({
//   server: {
//     host: true,
//     https: true
//   },
//   preview: {
//     host: true,
//     https: true
//   },
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       manifest: {
//         name: 'Visitor Approval System',
//         short_name: 'VisitorApp',
//         description: 'Company Visitor Management',
//         theme_color: '#1677ff',
//         background_color: '#ffffff',
//         display: 'standalone',
//         start_url: '/',
//         icons: [
//           {
//             src: '/icon-192.png',
//             sizes: '192x192',
//             type: 'image/png'
//           },
//           {
//             src: '/icon-512.png',
//             sizes: '512x512',
//             type: 'image/png',
//             purpose: 'any maskable'
//           }
//         ]
//       }
//     })
//   ]
// })



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'

export default defineConfig({
  preview: {
    host: true,
    https: {
      key: fs.readFileSync('./192.168.0.101-key.pem'),
      cert: fs.readFileSync('./192.168.0.101.pem'),
    },
  },
  plugins: [
    react(),
   VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['icon-192.png', 'icon-512.png'],
  manifest: {
    name: 'Visitor Approval System',
    short_name: 'VisitorApp',
    description: 'Company Visitor Management',
    theme_color: '#ffffff',   
    background_color: '#ffffff',  
    display: 'standalone',
    start_url: '/',
    scope: '/',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  }
})

  ]
})
