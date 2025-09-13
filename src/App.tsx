import React, { useState, useEffect } from 'react';
import { Search, Book, Heart, Star, ExternalLink, Loader2 } from 'lucide-react';

interface BookResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
  isbn?: string[];
}

interface BookDetails extends BookResult {
  description?: string | { value: string };
  publishers?: string[];
  publish_date?: string[];
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<BookResult[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookDetails | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [bookDetailsLoading, setBookDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');

  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=12`);
      const data = await response.json();
      setBooks(data.docs || []);
    } catch (error) {
      console.error('Error searching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookDetails = async (workKey: string) => {
    setBookDetailsLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org${workKey}.json`);
      const data = await response.json();
      setSelectedBook(data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setBookDetailsLoading(false);
    }
  };

  const toggleFavorite = (bookKey: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(bookKey)) {
      newFavorites.delete(bookKey);
    } else {
      newFavorites.add(bookKey);
    }
    setFavorites(newFavorites);
  };

  const getCoverUrl = (coverId: number, size: string = 'M') => {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  };

  const favoriteBooks = books.filter(book => favorites.has(book.key));

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchBooks(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                <Book className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">BookFinder</h1>
            </div>
            
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'search'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Search
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all relative ${
                  activeTab === 'favorites'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Favorites
                {favorites.size > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.size}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && (
          <>
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for books by title..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-colors bg-white/80 backdrop-blur-sm"
                />
              </div>
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                </div>
              )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <div
                  key={book.key}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => fetchBookDetails(book.key)}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {book.cover_i ? (
                      <img
                        src={getCoverUrl(book.cover_i)}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Book className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(book.key);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
                        favorites.has(book.key)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${favorites.has(book.key) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                    {book.author_name && (
                      <p className="text-sm text-gray-600 mb-2">
                        by {book.author_name[0]}
                      </p>
                    )}
                    {book.first_publish_year && (
                      <p className="text-xs text-gray-500">
                        Published: {book.first_publish_year}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'favorites' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Your Favorite Books ({favorites.size})
            </h2>
            {favoriteBooks.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No favorite books yet</p>
                <p className="text-gray-400">Search for books and add them to your favorites!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteBooks.map((book) => (
                  <div
                    key={book.key}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={() => fetchBookDetails(book.key)}
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {book.cover_i ? (
                        <img
                          src={getCoverUrl(book.cover_i)}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Book className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(book.key);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white backdrop-blur-sm transition-all hover:bg-red-600"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </h3>
                      {book.author_name && (
                        <p className="text-sm text-gray-600 mb-2">
                          by {book.author_name[0]}
                        </p>
                      )}
                      {book.first_publish_year && (
                        <p className="text-xs text-gray-500">
                          Published: {book.first_publish_year}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Book Details Modal */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto w-full">
              {bookDetailsLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading book details...</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-gray-900 pr-4">
                        {selectedBook.title}
                      </h2>
                      <button
                        onClick={() => setSelectedBook(null)}
                        className="text-gray-400 hover:text-gray-600 p-2"
                      >
                        <ExternalLink className="h-5 w-5 rotate-45" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-shrink-0">
                        {selectedBook.cover_i ? (
                          <img
                            src={getCoverUrl(selectedBook.cover_i, 'L')}
                            alt={selectedBook.title}
                            className="w-48 h-64 object-cover rounded-lg shadow-md mx-auto"
                          />
                        ) : (
                          <div className="w-48 h-64 bg-gray-200 rounded-lg flex items-center justify-center mx-auto">
                            <Book className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        {selectedBook.author_name && (
                          <p className="text-lg text-gray-600 mb-3">
                            by {selectedBook.author_name.join(', ')}
                          </p>
                        )}
                        
                        <div className="space-y-3 mb-6">
                          {selectedBook.first_publish_year && (
                            <p className="text-gray-700">
                              <span className="font-semibold">Published:</span> {selectedBook.first_publish_year}
                            </p>
                          )}
                          {selectedBook.publishers && (
                            <p className="text-gray-700">
                              <span className="font-semibold">Publisher:</span> {selectedBook.publishers[0]}
                            </p>
                          )}
                          {selectedBook.subject && (
                            <div>
                              <p className="font-semibold text-gray-700 mb-2">Subjects:</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedBook.subject.slice(0, 6).map((subject, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                  >
                                    {subject}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {selectedBook.description && (
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {typeof selectedBook.description === 'string'
                                ? selectedBook.description
                                : selectedBook.description.value}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;