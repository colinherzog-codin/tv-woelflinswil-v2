import type { Block } from 'payload'
import { lexicalEditor, FixedToolbarFeature, InlineToolbarFeature } from '@payloadcms/richtext-lexical'

export const Downloads: Block = {
  slug: 'downloadsBlock',
  interfaceName: 'DownloadsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'files',
      type: 'array',
      label: 'Files',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'files', // This is the collection where files (PDFs/Word) are uploaded
          required: true,
        },
      ],
    },
  ],
}
