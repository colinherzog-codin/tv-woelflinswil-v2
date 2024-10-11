import AlbumPhotosClient from './AlbumPhotosClient';

// Ensure that `params` is passed as a Promise and awaited
type Args = {
  params: Promise<{ id: string }>;
};

export default async function AlbumPhotosPage({ params }: Args) {
  const { id } = await params;  // Await the params, extracting the album id

  return (
    <div>
      {/* Pass the album id to the client-side component */}
      <AlbumPhotosClient albumId={id} />
    </div>
  );
}
