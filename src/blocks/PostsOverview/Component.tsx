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
    depth: 1,
    limit: 3,
    sort: 'createdAt:desc',
  })
  return (
    <div className="pt-2 pb-24">
      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={3}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}
