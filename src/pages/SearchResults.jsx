import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, User, Scale, FileText, Newspaper, ArrowRight, Loader } from 'lucide-react';
import { SearchService } from '../services/search-service';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        performSearch();
    }, [query]);

    const performSearch = async () => {
        setLoading(true);
        try {
            const data = await SearchService.searchAll(query);
            setResults(data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const ResultSection = ({ title, items, icon: Icon }) => {
        if (!items || items.length === 0) return null;

        return (
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                    <Icon className="h-6 w-6 mr-2 text-accent" />
                    {title} ({items.length})
                </h2>
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:border-accent transition-colors cursor-pointer"
                        >
                            <h3 className="text-lg font-semibold text-primary mb-2">
                                {item.name || item.case_title || item.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">
                                {item.specialization || item.summary || item.description || item.excerpt}
                            </p>
                            {item.location && (
                                <p className="text-gray-500 text-xs mt-2">{item.location}</p>
                            )}
                            {item.case_number && (
                                <p className="text-gray-500 text-xs mt-2">Case No: {item.case_number}</p>
                            )}
                            {item.court && (
                                <p className="text-gray-500 text-xs mt-1">Court: {item.court}</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold text-primary mb-2">Search Results</h1>
                {query && (
                    <p className="text-lg text-gray-600">
                        Showing results for: <span className="font-semibold text-accent">"{query}"</span>
                    </p>
                )}
            </motion.div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader className="h-12 w-12 text-accent animate-spin mb-4" />
                    <p className="text-gray-600">Searching...</p>
                </div>
            ) : results && results.totalResults > 0 ? (
                <>
                    <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                        <p className="text-primary font-semibold">
                            Found {results.totalResults} result{results.totalResults !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <ResultSection
                        title="Advocates"
                        items={results.advocates}
                        icon={User}
                    />

                    <ResultSection
                        title="Judgements"
                        items={results.judgements}
                        icon={Scale}
                    />

                    <ResultSection
                        title="Bare Acts"
                        items={results.bareActs}
                        icon={FileText}
                    />

                    <ResultSection
                        title="News"
                        items={results.news}
                        icon={Newspaper}
                    />
                </>
            ) : (
                <div className="text-center py-20">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-600 mb-2">No Results Found</h2>
                    <p className="text-gray-500">
                        {query
                            ? `We couldn't find anything matching "${query}". Try different keywords.`
                            : 'Enter a search query to get started.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
