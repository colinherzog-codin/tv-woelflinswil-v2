'use client'
import React, { useState, useEffect, useRef } from 'react'

import type { Footer, Header, Media } from '@/payload-types'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faChevronDown, faTimes } from '@awesome.me/kit-693429779d/icons/classic/solid'
import Image from 'next/image'
import { CMSLink } from '@/components/Link'

interface HeaderClientProps {
  header: Header | Footer
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    setDropdownOpen(false) // Ensure dropdown is closed when the mobile menu is toggled
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false)
    }
  }

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  if (!header.navItems) {
    return (<>y</>)
  }

  header = header as Header
  return (
    <header className="z-50 relative">
      <nav className="bg-background text-foreground">
        <div className="container flex justify-between items-center py-4">
          <div className="text-2xl font-bold">
            <Link href="/">
              <Image
                src={'TVWWIL00000002/' + (header.logo as Media).filename}
                className="mr-3 h-9 flex"
                width={80}
                height={60}
                alt={(header.logo as Media).alt}
              />
            </Link>
          </div>
          <div className="hidden md:flex space-x-6">
            {header.navItems?.map((navItem, index) => (
              navItem.type === 'link' ? (
                  <CMSLink {...navItem.link} appearance="navBarSimpleLink" className="z-20" key={index} />) :
                (
                  <div className="relative" key={index} ref={dropdownRef}>
                    <button
                      onClick={toggleDropdown}
                      className="hover:text-primary-foreground flex items-center"
                    >
                      {navItem.dropdownTitle} <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg bg-card text-card-foreground z-10">
                        {navItem.dropdownLinks?.map((dropdownLink, dropdownIndex) => (
                          <CMSLink
                            {...dropdownLink.link}
                            appearance="dropdownLink"
                            className="z-20"
                            key={dropdownIndex}
                            onClickHandler={() => setDropdownOpen(false)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
            ))}
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? (<FontAwesomeIcon icon={faTimes} className="h-6 w-6" />) : (
                <FontAwesomeIcon icon={faBars} className="h-6 w-6" />)}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            {header.navItems?.map((navItem, index) => (
              navItem.type === 'link' ? (
                <CMSLink
                  {...navItem.link}
                  appearance="navBarSimpleLinkMobile"
                  className="block px-4 py-2 hover:bg-muted"
                  key={index}
                  onClickHandler={() => setIsOpen(false)}
                />
              ) : (
                <div key={index} className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="block w-full text-left px-4 py-2 hover:bg-muted"
                  >
                    {navItem.dropdownTitle}
                  </button>
                  {dropdownOpen && (
                    <div className="px-4">
                      {navItem.dropdownLinks?.map((dropdownLink, dropdownIndex) => (
                        <CMSLink
                          {...dropdownLink.link}

                          appearance="dropdownLinkMobile"
                          className="block px-4 py-2 hover:bg-muted"
                          key={dropdownIndex}
                          onClickHandler={() => setIsOpen(false)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        )}

      </nav>
    </header>
  )
}
