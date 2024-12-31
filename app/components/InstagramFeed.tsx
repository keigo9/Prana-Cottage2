import {useState, useRef} from 'react';
import type {InstagramPost} from '~/lib/instagram';

function InstagramModal({
  post,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  post: InstagramPost;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
          aria-label="Previous post"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
      )}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
          aria-label="Next post"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>
      )}
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex items-center">
          <a
            href="https://www.instagram.com/prana_cottage_amami/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:opacity-80"
          >
            <svg
              className="w-6 h-6 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span className="font-medium">prana_cottage_amami</span>
          </a>
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-[500px] aspect-square relative">
            {post.media_type === 'VIDEO' ? (
              <video
                src={post.media_url}
                poster={post.thumbnail_url}
                className="absolute inset-0 w-full h-full object-contain bg-black"
                controls
                playsInline
                preload="metadata"
              >
                <track kind="captions" src="" label="English" />
              </video>
            ) : (
              <img
                src={post.media_url}
                alt={post.caption || 'Instagram post'}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-4 flex-1">
            <p className="whitespace-pre-line">{post.caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const InstagramFeed = ({
  instagramPosts,
}: {
  instagramPosts: InstagramPost[];
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < instagramPosts.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {instagramPosts.map((post, index) => (
          <button
            key={post.id}
            onClick={() => setSelectedIndex(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedIndex(index);
              }
            }}
            className="relative aspect-square overflow-hidden group cursor-pointer border-none bg-transparent p-0"
          >
            <img
              src={
                post.media_type === 'VIDEO'
                  ? post.thumbnail_url
                  : post.media_url
              }
              alt={post.caption || 'Instagram post'}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
            {post.media_type === 'VIDEO' && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 5v10l7-5-7-5z" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      {selectedIndex !== null && (
        <InstagramModal
          post={instagramPosts[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < instagramPosts.length - 1}
        />
      )}
    </>
  );
};
