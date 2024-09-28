import type { Block } from 'payload'
import { lexicalEditor, FixedToolbarFeature, InlineToolbarFeature } from '@payloadcms/richtext-lexical'
import { CommitteesBlock } from '@/blocks/Committees/Component'

export const Committees: Block = {
  slug: 'committeesBlock',
  interfaceName: 'CommitteesBlock',
  fields: [
    {
      name: 'committees',
      type: 'array',
      label: 'Committees',
      fields: [
        {
          name: 'photo',
          type: 'upload',
          label: 'Committee Photo',
          relationTo: 'media', // Refers to the media collection for the image
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Committee Title',
          required: true,
        },
        {
          name: 'persons',
          type: 'array',
          label: 'Members',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
              required: true,
            },
            {
              name: 'function',
              type: 'text',
              label: 'Function',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
