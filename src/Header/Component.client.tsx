'use client'
import React, { useState, useEffect, useRef } from 'react'

import type { Footer, Header, Media, Page } from '@/payload-types'
import Image from 'next/image'
import { CMSLink } from '@/components/Link'
import { MegaMenu, Navbar } from 'flowbite-react'
import { usePathname } from 'next/navigation'

interface HeaderClientProps {
  header: Header | Footer
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const pathname = usePathname()

  function getHref(link: {
    type?: ('reference' | 'custom') | null
    newTab?: boolean | null
    reference?: {
      relationTo: 'pages'
      value: string | Page
    } | null
    url?: string | null
    label: string
  }) {
    const href = link.type === 'reference' && typeof link.reference?.value === 'object' && link.reference.value.slug ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}` : link.url
    return href || ''
  }

  header = header as Header

  return (<header>
    <MegaMenu fluid className="bg-blue-800 text-white">
      <Navbar.Brand href="/">
        <Image
          src={'TVWWIL00000002/' + (header.logo as Media).filename}
          className="mr-3 h-9 flex"
          width={80}
          height={40}
          alt={(header.logo as Media).alt}
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white"></span>
      </Navbar.Brand>
      <div className="flex items-center gap-3 lg:order-2">
        <Navbar.Toggle theme={{ icon: 'h-5 w-5 shrink-0 ' }} className="z-10 text-white color-white hover:bg-blue-600 " />
      </div>
      <Navbar.Collapse
        theme={{
          list: 'mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-base [&_a]:font-medium',
        }}
        className="md:order-1"
      >
        {header.navItems?.map((navItem, index) => (<>
          {navItem.type === 'link' ? (<Navbar.Link href={getHref(navItem.link!)} className="z-10 relative text-white hover:bg-blue-600 ">
            {navItem.link?.label}
          </Navbar.Link>) : (<li className="z-20">
            <div
              className="block py-2 pr-4 pl-3 font-semibold text-white border-b border-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-600 lg:p-0 dark:text-gray-400 lg:dark:hover:text-primary-500 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 hover:bg-blue-600">
              <MegaMenu.Dropdown
                toggle={<span>{navItem.dropdownTitle}</span>}
                className="z-10 max-w-[90vw]"
              >
                <div
                  className="grid w-full bg-white dark:border-gray-700 dark:bg-gray-700 lg:w-auto lg:grid-cols-3 lg:rounded-lg">
                  <div
                    className="bg-white p-2 text-gray-900 dark:bg-gray-800 dark:text-white lg:col-span-2 lg:rounded-lg">
                    <ul>
                      {navItem.dropdownLinks?.map((dropdownLink, dropdownLinkIndex) => (<li key={dropdownLinkIndex}>
                        <a
                          href={getHref(dropdownLink.link)}
                          className="flex items-center rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <div>
                            <div className="font-semibold">
                              {dropdownLink.link.label}
                            </div>
                          </div>
                        </a>
                      </li>))}
                    </ul>
                  </div>
                </div>
              </MegaMenu.Dropdown>
            </div>
          </li>)}
        </>))}
      </Navbar.Collapse>
    </MegaMenu>
  </header>)
}
