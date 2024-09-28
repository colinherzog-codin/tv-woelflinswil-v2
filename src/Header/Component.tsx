import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer, Header } from '@/payload-types'

export async function Header() {
  const header: Header | Footer = await getCachedGlobal('header', 1)()

  return <HeaderClient header={header}/>
}
