import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from 'src/utilities/cn'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
  onClickHandler?: () => void
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
    onClickHandler,
  } = props

  // Determine the href based on whether it's a reference or a custom URL
  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${reference.value.slug}`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  if (appearance === 'navBarSimpleLink') {
    return (
      <Link href={href} className="hover:text-secondary">
        {label && label}
      </Link>
    )
  }

  if (appearance === 'dropdownLink') {
    return (
      <Link href={href} className="block px-4 py-2 hover:bg-muted">
        {label && label}
      </Link>
    )
  }
  if (appearance === 'navBarSimpleLinkMobile') {
    return (
      <Link href={href} className="block px-4 py-2 hover:bg-muted">
        {label && label}
      </Link>
    )
  }

  if (appearance === 'dropdownLinkMobile') {
    return (
      <Link href={href} className="block px-4 py-2 hover:bg-muted">
        {label && label}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
