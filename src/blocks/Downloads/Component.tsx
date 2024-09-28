import React from 'react'
import { cn } from 'src/utilities/cn'
import Link from 'next/link'
import RichText from '@/components/RichText'
import { DownloadsBlock as DownloadsBlockProps } from '@/payload-types'

type Props = {
  className?: string
} & DownloadsBlockProps

export const DownloadsBlock: React.FC<Props> = ({ className, title, description, files }) => {
  return (
    <div className={cn('mx-auto my-8 w-full max-w-7xl px-4 lg:px-8', className)}>
      {/* Title and Description */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && <div className="prose max-w-none mx-auto text-gray-600"><RichText content={description} /></div>}
      </div>

      {/* Files Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {files?.map((fileItem, index) => {
          if (typeof fileItem.file === 'string') {
            return null
          }
          const file = fileItem?.file
          return (
            <div
              key={index}
              className="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
            >
              <div className="flex items-center space-x-4">
                <span className="font-medium text-lg text-gray-700 truncate">
                  {file?.fileName || 'Unknown file'}
                </span>
              </div>
              {/* Download Link */}
              <Link
                href={`${file?.url}`}
                download
                target="_blank"
                className="mt-4 inline-block text-primary font-semibold underline hover:text-primary-dark"
              >
                Download
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
