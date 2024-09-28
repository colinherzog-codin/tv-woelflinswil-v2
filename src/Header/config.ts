import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'type',
          label: 'Link Type',
          type: 'radio',
          options: [
            {
              label: 'Simple Link',
              value: 'link',
            },
            {
              label: 'Dropdown',
              value: 'dropdown',
            },
          ],
          defaultValue: 'link',
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'link',
            },
          },
        }),
        {
          name: 'dropdownTitle',
          label: 'Dropdown Title',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
          },
        },
        {
          name: 'dropdownLinks',
          label: 'Dropdown Links',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
          },
        }
      ],
      maxRows: 6,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    }
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
