// import React, { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { searchVideos, clearSearchResults } from '../redux/videoSlice';
// import VideoCard, { VideoCardSkeleton } from '../components/VideoCard';

// const SearchResults = () => {
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const { searchResults, isLoading, error } = useSelector((state) => state.videos);
  
//   const query = new URLSearchParams(location.search).get('q');

//   useEffect(() => {
//     if (query) {
//       dispatch(searchVideos(query));
//     }
    
//     return () => {
//       dispatch(clearSearchResults());
//     };
//   }, [dispatch, query]);

//   if (!query) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-gray-400 text-6xl mb-4">🔍</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">No search query</h2>
//           <p className="text-gray-600">Please enter a search term to find videos.</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Search failed</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => dispatch(searchVideos(query))}
//             className="btn-hover bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Search Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">
//             Search results for "{query}"
//           </h1>
//           {!isLoading && (
//             <p className="text-gray-600">
//               {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
//             </p>
//           )}
//         </div>

//         {/* Results */}
//         {isLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {Array.from({ length: 12 }, (_, index) => (
//               <VideoCardSkeleton key={index} />
//             ))}
//           </div>
//         ) : searchResults.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {searchResults.map((video) => (
//               <VideoCard key={video.id} video={video} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-6xl mb-4">🔍</div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">No results found</h2>
//             <p className="text-gray-600 mb-4">
//               Try different keywords or remove search filters
//             </p>
//             <div className="text-left max-w-md mx-auto space-y-2 text-gray-600">
//               <p className="font-medium">Try:</p>
//               <ul className="list-disc list-inside space-y-1 text-sm">
//                 <li>Using different keywords</li>
//                 <li>Checking your spelling</li>
//                 <li>Using more general search terms</li>
//                 <li>Trying fewer keywords</li>
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchResults;


import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchVideos, clearSearchResults } from '../redux/videoSlice';
import VideoCard, { VideoCardSkeleton } from '../components/VideoCard';
import { useDebounce } from '../hooks/useDebounce';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchResults, isLoading, error } = useSelector((state) => state.videos);

  // Extract query from URL
  const query = new URLSearchParams(location.search).get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);

  // Debounce for smooth API calls
  const debouncedSearch = useDebounce(searchTerm, 500);

  // When debounced value changes → update URL & fetch
  useEffect(() => {
    if (debouncedSearch.trim()) {
      navigate(`?q=${debouncedSearch}`);
      dispatch(searchVideos(debouncedSearch));
    }
    return () => {
      dispatch(clearSearchResults());
    };
  }, [debouncedSearch, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Search Header */}
        {query && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Search results for "{query}"
            </h1>
            {!isLoading && (
              <p className="text-gray-600">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        )}

        {/* Error Handling */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Search failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => dispatch(searchVideos(query))}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!error && (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }, (_, index) => (
                  <VideoCardSkeleton key={index} />
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No results found</h2>
                <p className="text-gray-600 mb-4">
                  Try different keywords or remove search filters
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                🔍 Start typing to search videos...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
