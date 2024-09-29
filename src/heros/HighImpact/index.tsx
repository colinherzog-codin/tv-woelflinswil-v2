'use client'
import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="relative -mt-[10.4rem] flex items-end justify-center text-white min-h-[80vh]" data-theme="dark">
      <div
        className="container mb-8 z-10 relative flex flex-col items-center justify-center text-center"> {/* Added padding at the bottom */}
        <div className="max-w-[34rem]">
          {richText && <RichText className="mb-6" content={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (<ul className="flex gap-4 justify-center">
              {links.map(({ link }, i) => {
                return (<li key={i}>
                    <CMSLink {...link} />
                  </li>)
              })}
            </ul>)}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (<React.Fragment>
            <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
            <div
              className="absolute pointer-events-none left-0 bottom-0 w-full h-2/3 bg-gradient-to-t from-black to-transparent" />
          </React.Fragment>)}
      </div>
    </div>)
}
