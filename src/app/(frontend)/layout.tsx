import type { Metadata } from 'next'

import { cn } from 'src/utilities/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React, { Suspense } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (<html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
  <head>
    <link href="/favicon.ico" rel="icon" sizes="32x32" />
    <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
  </head>
  <body className="flex flex-col h-screen justify-between">
  <AdminBar
    adminBarProps={{
      preview: isEnabled,
    }}
  />
  <LivePreviewListener />

  <Header />
  <Suspense fallback={<div>Loading...</div>}>
    {children}
  </Suspense>
  <Footer />
  </body>
  </html>)
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image', creator: '@payloadcms',
  },
}
