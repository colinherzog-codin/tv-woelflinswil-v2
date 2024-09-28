'use client'
import React, { useState } from 'react'

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

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  if (!header.navItems) {
    return (<>y</>);
  }
  header = header as Header
  return (<header className="z-50 relative">
    <nav className="bg-background text-foreground border-b border-border">
      <div className="container flex justify-between items-center py-4">
        <div className="text-2xl font-bold">
          <Link href="/">
            <Image
              src={process.env.CUSTOMER_ID + '/' + (header.logo as Media).filename}
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
              <div className="relative" key={index}>
                <button
                  onClick={toggleDropdown}
                  className="hover:text-primary-foreground flex items-center"
                >
                  {navItem.dropdownTitle} <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg bg-card text-card-foreground z-10">
                    {navItem.dropdownLinks?.map((dropdownLink, dropdownIndex) => (
                      <CMSLink {...dropdownLink.link} appearance="dropdownLink" className="z-20"
                               key={dropdownIndex}></CMSLink>))}
                  </div>)}
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
      {isOpen && (<div className="md:hidden">
        <Link href="/" className="block px-4 py-2 hover:bg-muted">
          Home
        </Link>
        <Link href="/about" className="block px-4 py-2 hover:bg-muted">
          About
        </Link>
        <button
          onClick={toggleDropdown}
          className="block w-full text-left px-4 py-2 hover:bg-muted"
        >
          Services
        </button>
        {dropdownOpen && (<div className="px-4">
          <Link href="/service1" className="block px-4 py-2 hover:bg-muted">
            Service 1
          </Link>
          <Link href="/service2" className="block px-4 py-2 hover:bg-muted">
            Service 2
          </Link>
          <Link href="/service3" className="block px-4 py-2 hover:bg-muted">
            Service 3
          </Link>
        </div>)}
        <Link href="/contact" className="block px-4 py-2 hover:bg-muted">
          Contact
        </Link>
      </div>)}
    </nav>
  </header>)
}
