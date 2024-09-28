'use client'

export default function loader({ src, width, quality }) {
  return `https://imagedelivery.net/${process.env.CLOUDFLARE_ACCOUNT_HASH}/${src}/${quality || 'public'}`
}
