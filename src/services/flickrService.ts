// services/flickrService.ts
const USER_ID = process.env.NEXT_PUBLIC_FLICKR_USER_ID || '185286431@N04';
const API_KEY = process.env.NEXT_PUBLIC_FLICKR_API_KEY || 'e8cb1ebb4e660ac86da3602c65cb2973';

export interface Collection {
  id: string;
  title: { _content: string };
  set: Album[];
}

export interface Album {
  id: string;
  title: { _content: string };
}

export interface Photo {
  id: string;
  title: string;
  server: string;
  secret: string;
  farm: number;
}

async function fetchFromFlickr(endpoint: string, params: Record<string, string>): Promise<any> {
  const url = new URL(`https://api.flickr.com/services/rest/?method=${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('format', 'json');
  url.searchParams.set('nojsoncallback', '1');

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString());
  return response.json();
}

export async function getCollections(): Promise<Collection[]> {
  const response = await fetchFromFlickr('flickr.collections.getTree', {
    user_id: USER_ID,
  });
  return response.collections.collection;
}

export async function getAlbumsInCollection(collectionId: string): Promise<Album[]> {
  const response = await fetchFromFlickr('flickr.collections.getTree', {
    collection_id: collectionId,
    user_id: USER_ID,
  });
  return response.collections.collection[0].set;
}

export async function getPhotosInAlbum(albumId: string, page: number = 1): Promise<{ photos: Photo[], pages: number }> {
  const PER_PAGE = 20;
  const response = await fetchFromFlickr('flickr.photosets.getPhotos', {
    user_id: USER_ID,
    photoset_id: albumId,
    per_page: PER_PAGE.toString(),
    page: page.toString(),
  });

  const photoset = response.photoset;
  if (!photoset || !photoset.photo) {
    throw new Error('Invalid API response structure');
  }

  return {
    photos: photoset.photo,
    pages: photoset.pages, // Total number of pages
  };
}
