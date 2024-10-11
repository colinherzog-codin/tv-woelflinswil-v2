'use client';

import { useState, useEffect } from 'react';
import { getPhotosInAlbum, Photo } from '@/services/flickrService';
import { useSwipeable } from 'react-swipeable';

// Define the type for params
type Args = {
  params: {
    id?: string;
  };
};

// No `generateStaticParams` is needed if you're using dynamic routes.
// If you plan on pre-generating some pages, you can add it back based on your use case.
// For now, we'll assume this is fully dynamic.

// AlbumPhotos component now accepts params as an argument
export default function AlbumPhotos({ params }: Args) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null); // For lightbox
  const [showLightbox, setShowLightbox] = useState<boolean>(false); // Lightbox visibility
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false); // Loading state for more photos

  // Fetch photos when the component mounts or when the page number changes
  useEffect(() => {
    if (!params.id) return;

    async function fetchPhotos() {
      const { photos: newPhotos, pages } = await getPhotosInAlbum(params.id ||'', page);
      setPhotos((prev) => [...prev, ...newPhotos]);
      setTotalPages(pages);
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

  // Load more photos when the user requests more
  const loadMorePhotos = async () => {
    if (page < totalPages && !isLoadingMore) {
      setIsLoadingMore(true); // Set loading state
      setPage(page + 1); // Increment page count to load more photos
      setIsLoadingMore(false);
    }
  };

  // Open the lightbox for a specific photo
  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setShowLightbox(true);
  };

  // Close the lightbox
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

  // Navigate to the next photo and load more if needed
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

  // Navigate to the previous photo
  const prevPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  // Render the component
  return (
    <div className="p-6">
      {/* Grid of album photos */}
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

      {/* Load more photos button */}
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
            {/* Show left arrow if not on the first image */}
            {selectedPhotoIndex > 0 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-6xl p-4"
                onClick={prevPhoto}
              >
                &#8249;
              </button>
            )}
            {/* Show right arrow if not on the last image or if more photos can be loaded */}
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

// ProgressiveImage Component
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
