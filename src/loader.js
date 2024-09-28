'use client'

export default function loader({ src, width, quality }) {
  return `https://imagedelivery.net/I0J5Hf72cajdylC8kIE-BQ/${src}/${quality || 'public'}`
}
