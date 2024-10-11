'use client';

import { useState, useEffect } from 'react';
import { getPhotosInAlbum, Photo } from '@/services/flickrService';
import { useSwipeable } from 'react-swipeable';

export default function Page({ params }: { params: { id: string } }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null); // For lightbox
  const [showLightbox, setShowLightbox] = useState<boolean>(false); // Lightbox visibility
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false); // Loading state for more photos

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const { photos: newPhotos, pages } = await getPhotosInAlbum(params.id, page);
        setPhotos((prev) => [...prev, ...newPhotos]);
        setTotalPages(pages);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    }

    fetchPhotos();
  }, [params.id, page]);

  // Handle Escape key to close the lightbox
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    };

    if (showLightbox) {
      window.addEventListener('keydown', handleEscape);
    } else {
      window.removeEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape); // Cleanup listener when component unmounts
    };
  }, [showLightbox]);

  const loadMorePhotos = async () => {
    if (page < totalPages && !isLoadingMore) {
      setIsLoadingMore(true); // Set loading state
      setPage(page + 1);
      setIsLoadingMore(false);
    }
  };

  // Open lightbox
  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setShowLightbox(true);
  };

  // Close lightbox
  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedPhotoIndex(null);
  };

  // Swipe handlers for mobile
  const handlers = useSwipeable({
    onSwipedLeft: () => nextPhoto(),
    onSwipedRight: () => prevPhoto(),
    preventScrollOnSwipe: true,
    trackMouse: true, // Allows mouse swiping as well
  });

  // Navigate next photo and load more if needed
  const nextPhoto = async () => {
    if (selectedPhotoIndex !== null) {
      // Check if it's the last photo and if more photos can be loaded
      if (selectedPhotoIndex === photos.length - 1 && page < totalPages) {
        await loadMorePhotos(); // Load more photos if we are at the end
      }
      if (selectedPhotoIndex < photos.length - 1) {
        setSelectedPhotoIndex(selectedPhotoIndex + 1); // Move to the next photo
      }
    }
  };

  // Navigate previous photo
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
            onClick={() => openLightbox(index)} // Open lightbox on click
          />
        ))}
      </div>

      {page < totalPages && (
        <button
          className="mt-6 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={loadMorePhotos}
          disabled={isLoadingMore} // Disable the button while loading
        >
          {isLoadingMore ? 'Lädt...' : 'Mehr Fotos laden'}
        </button>
      )}

      {/* Lightbox Modal */}
      {showLightbox && selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          {...handlers} // Apply swipe handlers
        >
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={closeLightbox}>
            &times;
          </button>
          <div className="relative">
            <img
              src={`https://live.staticflickr.com/${photos[selectedPhotoIndex].server}/${photos[selectedPhotoIndex].id}_${photos[selectedPhotoIndex].secret}_b.jpg`}
              alt={photos[selectedPhotoIndex].title}
              className="max-w-full max-h-full rounded-lg shadow-lg"
              onDragStart={(e) => e.preventDefault()} // Prevent dragging the image
            />
            {/* Show chevron left only if not on the first image */}
            {selectedPhotoIndex > 0 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-6xl p-4"
                onClick={prevPhoto}
              >
                &#8249;
              </button>
            )}
            {/* Show chevron right if there are more photos to load or not on the last image */}
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

// Progressive Image Component
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

  const handleHighResLoad = () => {
    setIsHighResLoaded(true);
    setSrc(highResSrc);
  };

  return (
    <div className="relative cursor-pointer" onClick={onClick} style={{ height: '200px', maxWidth: '100%' }}>
      {/* Low-res image */}
      <img
        src={src}
        alt={alt}
        className={`h-full w-auto max-w-full rounded-lg shadow-lg bg-background text-foreground transition-opacity duration-500 ${
          isHighResLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />

      {/* High-res image (loaded after low-res) */}
      <img
        src={highResSrc}
        alt={alt}
        onLoad={handleHighResLoad}
        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg transition-opacity duration-500 opacity-0"
        style={{ opacity: isHighResLoaded ? 1 : 0 }}
        onDragStart={(e) => e.preventDefault()} // Prevent dragging the image
      />
    </div>
  );
}
