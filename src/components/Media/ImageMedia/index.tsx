'use client'

import type { StaticImageData } from 'next/image'
import { cn } from 'src/utilities/cn'
import NextImage from 'next/image'
import React, { useCallback, useMemo, useState } from 'react'

import type { Props as MediaProps } from '../types'
import cssVariables from '@/cssVariables'
import { useRouter } from 'next/navigation'
import imageLoader from '@/loader'

const { breakpoints } = cssVariables

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority = false,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
  } = props

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps || ''
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource, filename: fullFilename, height: fullHeight, url, width: fullWidth,
    } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || altFromProps || ''

    // Ensure this path is valid for your loader or CDN
    src = `TVWWIL00000002/${fullFilename}`
  }

  // Memoizing the sizes to prevent recalculating on every render
  const sizes = useMemo(() => {
    return sizeFromProps ? sizeFromProps : Object.entries(breakpoints)
      .map(([, value]) => `(max-width: ${value}px) ${value}px`)
      .join(', ')
  }, [sizeFromProps, breakpoints])

  // Memoizing className computation for performance
  const imageClassName = useMemo(() => cn(imgClassName), [imgClassName])

  // Memoizing the onLoad handler for performance
  const handleLoad = useCallback(() => {
    setIsLoading(false)
    if (typeof onLoadFromProps === 'function') {
      onLoadFromProps()
    }
  }, [onLoadFromProps])

  return (
    <NextImage
      alt={alt}
      className={imageClassName}
      fill={fill}
      height={!fill ? height : undefined}
      onClick={onClick}
      onLoad={handleLoad}
      priority={priority}
      src={src}
      sizes={sizes}
      width={!fill ? width : undefined}
      loader={imageLoader} // Using the custom loader
    />
  )
}
