import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Files: CollectionConfig = {
  slug: 'files',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'fileName',
      type: 'text',
      required: true,
    },
  ],
  upload: {
  }
}
