'use client';
import { getAlbumsInCollection, Album } from '@/services/flickrService'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default async function CollectionAlbums() {
  const params = useParams<{ id: string; }>()
  const albums = await getAlbumsInCollection(params.id)

  return (<div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
          {albums.map((album: Album) => (<Link
              key={album.id}
              href={`/albums/${album.id}`}
              className="bg-background text-foreground shadow-lg rounded-lg p-4 hover:bg-gray-100 transition"
            >
              <h2 className="text-xl font-bold mb-2">{String(album.title) || ''}</h2>
            </Link>))}
        </div>
      </div>
    </div>)
}
