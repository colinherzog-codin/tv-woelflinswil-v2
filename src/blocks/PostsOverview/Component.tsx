import React from 'react'
import { PageRange } from '@/components/PageRange'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { PostsOverviewBlock as PostOverviewProps } from '@/payload-types'

type Props = {
  className?: string
} & PostOverviewProps

export const PostsOverviewBlock: React.FC<Props> = async() => {
  const payload = await getPayloadHMR({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 6,
    page: 1,
    sort: 'publishedAt:desc',
  })

  return (
    <div className="pt-2 pb-24">

      <CollectionArchive posts={posts.docs} />
    </div>
  )
}
