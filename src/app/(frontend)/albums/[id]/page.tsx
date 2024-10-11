import AlbumPhotosClient from './AlbumPhotosClient';

type Args = {
  params: { id: string };
};

export default async function AlbumPhotosPage({ params }: Args) {
  const { id } = params; // Extract the album id from the params

  return (
    <div>
      {/* Pass the album id to the client-side component */}
      <AlbumPhotosClient albumId={id} />
    </div>
  );
}
