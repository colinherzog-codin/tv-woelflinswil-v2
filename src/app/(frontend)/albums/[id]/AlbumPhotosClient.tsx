'use client'; // Client-side logic

import { useState, useEffect } from 'react';
import { getPhotosInAlbum, Photo } from '@/services/flickrService';
import { useSwipeable } from 'react-swipeable';

export default function AlbumPhotosClient({ albumId }: { albumId: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null); // For lightbox
  const [showLightbox, setShowLightbox] = useState<boolean>(false); // Lightbox visibility
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false); // Loading state for more photos

  useEffect(() => {
    async function fetchPhotos() {
      const { photos: newPhotos, pages } = await getPhotosInAlbum(albumId, page);
      setPhotos((prev) => [...prev, ...newPhotos]);
      setTotalPages(pages);
    }

    fetchPhotos();
  }, [albumId, page]);

  const loadMorePhotos = async () => {
    if (page < totalPages && !isLoadingMore) {
      setIsLoadingMore(true); // Set loading state
      setPage(page + 1);
      setIsLoadingMore(false);
    }
  };

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedPhotoIndex(null);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => nextPhoto(),
    onSwipedRight: () => prevPhoto(),
    preventScrollOnSwipe: true,
    trackMouse: true, // Allows mouse swiping as well
  });

  const nextPhoto = async () => {
    if (selectedPhotoIndex !== null) {
      if (selectedPhotoIndex === photos.length - 1 && page < totalPages) {
        await loadMorePhotos();
      }
      if (selectedPhotoIndex < photos.length - 1) {
        setSelectedPhotoIndex(selectedPhotoIndex + 1);
      }
    }
  };

  const prevPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <ProgressiveImage
            key={photo.id}
            lowResSrc={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`}
            highResSrc={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`}
            alt={photo.title}
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      {page < totalPages && (
        <button
          className="mt-6 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={loadMorePhotos}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? 'Lädt...' : 'Mehr Fotos laden'}
        </button>
      )}

      {showLightbox && selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          {...handlers}
        >
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={closeLightbox}>
            &times;
          </button>
          <div className="relative">
            <img
              src={`https://live.staticflickr.com/${photos[selectedPhotoIndex].server}/${photos[selectedPhotoIndex].id}_${photos[selectedPhotoIndex].secret}_b.jpg`}
              alt={photos[selectedPhotoIndex].title}
              className="max-w-full max-h-full rounded-lg shadow-lg"
              onDragStart={(e) => e.preventDefault()}
            />
            {selectedPhotoIndex > 0 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-6xl p-4"
                onClick={prevPhoto}
              >
                &#8249;
              </button>
            )}
            {(selectedPhotoIndex < photos.length - 1 || page < totalPages) && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-6xl p-4"
                onClick={nextPhoto}
              >
                &#8250;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ProgressiveImage Component remains unchanged
function ProgressiveImage({
                            lowResSrc,
                            highResSrc,
                            alt,
                            onClick,
                          }: {
  lowResSrc: string;
  highResSrc: string;
  alt: string;
  onClick: () => void;
}) {
  const [src, setSrc] = useState<string>(lowResSrc);
  const [isHighResLoaded, setIsHighResLoaded] = useState<boolean>(false);

  useEffect(() => {
    const img = new Image();
    img.src = highResSrc;
    img.onload = () => {
      setIsHighResLoaded(true);
      setSrc(highResSrc);
    };
  }, [highResSrc]);

  return (
    <div className="relative cursor-pointer" onClick={onClick} style={{ height: '200px', maxWidth: '100%' }}>
      <img
        src={src}
        alt={alt}
        className="h-full w-auto max-w-full rounded-lg shadow-lg bg-background text-foreground transition-opacity duration-500"
        loading="lazy"
        style={{ opacity: isHighResLoaded ? 1 : 0.5 }}
      />
    </div>
  );
}
