'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import TweetsList from '../../components/TweetList'; // Import your tweet list component

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchType, setSearchType] = useState('all'); // 'all', 'tweets', 'hashtags'

    useEffect(() => {
        if (!query) {
            setSearchResults([]);
            setLoading(false);
            return;
        }

        async function fetchSearchResults() {
            setLoading(true);
            setError(null);

            try {
                // Determine if query is a hashtag search
                const isHashtagSearch = query.startsWith('#');
                const searchTerm = isHashtagSearch ? query.substring(1) : query;

                // Build the search URL
                let searchUrl = `/api/search?`;

                if (isHashtagSearch || searchType === 'hashtags') {
                    searchUrl += `hashtag=${encodeURIComponent(searchTerm)}`;
                } else if (searchType === 'tweets') {
                    searchUrl += `keyword=${encodeURIComponent(searchTerm)}`;
                } else {
                    // Default: search both
                    searchUrl += `q=${encodeURIComponent(searchTerm)}`;
                }

                const response = await fetch(searchUrl, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Search failed with status: ${response.status}`);
                }

                const data = await response.json();
                setSearchResults(data);
            } catch (err) {
                console.error('Search error:', err);
                setError('Failed to fetch search results. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchSearchResults();
    }, [query, searchType]);

    // Handle filter changes
    const handleFilterChange = (type) => {
        setSearchType(type);
    };

    return (
        <div className="pt-24 px-4 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">
                    {query ? `Search results for "${query}"` : 'Search'}
                </h1>

                {/* Search filters */}
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => handleFilterChange('all')}
                        className={`px-4 py-2 rounded-full ${
                            searchType === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => handleFilterChange('tweets')}
                        className={`px-4 py-2 rounded-full ${
                            searchType === 'tweets'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        Tweets
                    </button>
                    <button
                        onClick={() => handleFilterChange('hashtags')}
                        className={`px-4 py-2 rounded-full ${
                            searchType === 'hashtags'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        Hashtags
                    </button>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* No results message */}
                    {searchResults.length === 0 && query && !loading && (
                        <div className="text-center py-8 text-gray-600">
                            No results found for "{query}". Try a different search term.
                        </div>
                    )}

                    {/* Results */}
                    {searchResults.length > 0 && (
                        <div>
                            <p className="mb-4 text-gray-600">{searchResults.length} results found</p>
                            <TweetsList tweets={searchResults} loading={false} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}