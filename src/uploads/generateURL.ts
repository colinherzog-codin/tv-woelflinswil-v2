import path from 'path'
import { Args } from '@/uploads/cloudflare-media-storage'
import { GenerateURL } from '@payloadcms/plugin-cloud-storage/types'

export const getGenerateURL =
  ({ accountHash, baseUrl }: Args): GenerateURL =>
  ({ filename, prefix = '' }) => {
    return `${baseUrl}/${accountHash}/${getFilename({ filename, prefix })}/format=auto`
  }

export const getFilename = ({ filename, prefix = '' }: { filename: string; prefix?: string }) => {
  console.log('*****************')
  console.log('*****************')
  console.log(path.posix.join(prefix, filename))
  return path.posix.join(prefix, filename)
}
