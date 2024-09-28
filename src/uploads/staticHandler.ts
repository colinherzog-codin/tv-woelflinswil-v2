import fetch from 'node-fetch'
import { getGenerateURL } from './generateURL'
import { Args } from '@/uploads/cloudflare-media-storage'
import { StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import { getFilePrefix } from '@payloadcms/plugin-cloud-storage/utilities'
import { CollectionConfig } from 'payload'

interface StaticHandlerArgs extends Args {
  collection: CollectionConfig
}

export const getHandler = ({
                             baseUrl,
                             accountHash,
                             accountId,
                             collection,
                             apiKey,
                           }: StaticHandlerArgs): StaticHandler => {
  const generateUrl = getGenerateURL({ accountHash, accountId, baseUrl, apiKey })

  return async (req, { params: { collection: collectionSlug, filename } }) => {
    if (collectionSlug !== collection.slug) {
      throw new Error('Invalid collection')
    }

    const prefix = getFilePrefix({ collection, filename, req })
    const fileKey = `${prefix}${filename}`

    const response = await fetch(`${baseUrl}/accounts/${accountId}/images/v1/${fileKey}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const buffer = await response.buffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
      },
    })
  }
}
