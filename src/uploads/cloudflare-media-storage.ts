import { getGenerateURL } from './generateURL'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { getHandler } from './staticHandler'
import { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'

export type Args = {
  baseUrl?: string
  apiKey: string
  accountHash: string
  accountId: string
}

export const cloudflareAdapter =
  ({ apiKey, accountHash, accountId, baseUrl = 'https://imagedelivery.net' }: Args): Adapter =>
  ({ collection, prefix }): GeneratedAdapter => {
    return {
      generateURL: getGenerateURL({ apiKey, accountHash, baseUrl, accountId }),
      handleDelete: getHandleDelete({ apiKey, accountHash, accountId }),
      handleUpload: getHandleUpload({ apiKey, accountHash, accountId, prefix }),
      staticHandler: getHandler({ apiKey, accountHash, collection, baseUrl, accountId }),
      name: 'cloudflare',
    }
  }
