import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CUPPER',
  description: 'Профессиональный SCA каппинг',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CUPPER',
    startupImage: [
      { url: '/splash/splash-iphone16.png', media: '(device-width: 430px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3)' },
    ],
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: [
      { url: '/icons/icon-180.png', sizes: '180x180' },
      { url: '/icons/icon-152.png', sizes: '152x152' },
      { url: '/icons/icon-144.png', sizes: '144x144' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0a0a0b',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
