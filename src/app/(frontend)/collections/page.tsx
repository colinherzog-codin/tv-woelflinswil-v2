import Link from 'next/link';
import { getCollections, Collection } from '@/services/flickrService';

export const revalidate = 3600; // Revalidate every hour

export default async function CollectionsOverview() {
  const collections = await getCollections();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {collections.map((collection: Collection) => (
        <Link
          key={collection.id}
          href={`/collections/${collection.id}`}
          className="bg-background text-foreground shadow-lg rounded-lg p-4 hover:bg-gray-100 transition"
        >
          <h2 className="text-xl font-bold mb-2">{String(collection.title) || ''}</h2>
        </Link>
      ))}
    </div>
  );
}
