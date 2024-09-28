import React from 'react'
import { cn } from 'src/utilities/cn'
import Image from 'next/image'
import { CommitteesBlock as CommitteesBlockProps, type Media } from '@/payload-types'

type Props = {
  className?: string
} & CommitteesBlockProps

export const CommitteesBlock: React.FC<Props> = ({ className, committees }) => {
  return (
    <div className={cn('mx-auto my-8 w-full max-w-7xl px-4 lg:px-8', className)}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {committees?.map((committee, index) => {
          const { photo, title, persons } = committee
          return (
            <div key={index} className="p-6 border rounded-lg bg-white shadow-lg">
              {/* Committee Photo */}
              {photo && (
                <div className="mb-4">
                  <Image
                    src={'TVWWIL00000002/' + (photo as Media).filename}
                    className="object-cover rounded-lg"
                    width={500}
                    height={300}
                    alt={(photo as Media).alt}
                  />
                </div>
              )}
              {/* Committee Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              {/* Persons in the Committee */}
              <ul className="space-y-2">
                {persons?.map((person, personIndex) => (
                  <li key={personIndex} className="flex flex-col">
                    <span className="font-medium text-gray-800">{person.name}</span>
                    <span className="text-sm text-gray-600">{person.function}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
