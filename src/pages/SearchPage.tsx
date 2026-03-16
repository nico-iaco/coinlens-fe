import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ImageUploadArea from '../components/ImageUploadArea';
import { searchCoin, type ApiSearchResponse } from '../services/coinService';

export default function SearchPage() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>();
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<ApiSearchResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleImageSelect = (file: File) => {
        setImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
        setSearchResult(null);
        setError(null);
    };

    const handleSearch = async () => {
        if (!image) return;
        setIsSearching(true);
        setError(null);
        try {
            const result = await searchCoin(image);
            setSearchResult(result);
        } catch (err) {
            console.error("Search failed", err);
            setError("Search failed. Please try again with a clearer photo.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddToCollection = () => {
        if (!searchResult) return;
        const { ai_analysis } = searchResult;
        // Navigate to upload page with state to pre-fill
        navigate('/add', { 
            state: { 
                prefill: {
                    name: ai_analysis.name,
                    country: ai_analysis.country,
                    year: ai_analysis.year,
                    universal_id: ai_analysis.universal_id,
                    imageBackPreview: preview,
                    imageBackFile: image
                }
            } 
        });
    };

    return (
        <div className="page container">
            <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                <h1>Search by Photo</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Identify a coin using a photo of its reverse side</p>
            </header>

            <div style={{ maxWidth: '400px', margin: '0 auto var(--spacing-2xl)' }}>
                <ImageUploadArea
                    label="Back Side (Reverse)"
                    onImageSelected={handleImageSelect}
                    previewUrl={preview}
                />
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
                    <button
                        className="premium-button"
                        disabled={!image || isSearching}
                        onClick={handleSearch}
                        style={{ width: '100%', opacity: (!image || isSearching) ? 0.5 : 1 }}
                    >
                        {isSearching ? 'Searching...' : 'Identify Coin ✨'}
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ 
                    color: 'var(--color-danger, #ff4d4f)', 
                    textAlign: 'center', 
                    padding: 'var(--spacing-md)',
                    background: 'rgba(255, 77, 79, 0.1)',
                    borderRadius: '8px',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    {error}
                </div>
            )}

            {searchResult && (
                <div className="glass-card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-xl)' }}>
                        {/* AI Analysis Section */}
                        <section>
                            <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                                Identification Result
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div><strong>Name:</strong> {searchResult.ai_analysis.name}</div>
                                <div><strong>Country:</strong> {searchResult.ai_analysis.country}</div>
                                <div><strong>Year:</strong> {searchResult.ai_analysis.year}</div>
                                <div><strong>Universal ID:</strong> <span style={{ color: 'var(--color-accent)' }}>{searchResult.ai_analysis.universal_id}</span></div>
                            </div>

                            <button 
                                className="premium-button" 
                                style={{ marginTop: 'var(--spacing-lg)', width: '100%' }}
                                onClick={handleAddToCollection}
                            >
                                Add to collection
                            </button>
                        </section>

                        {/* Local Matches Section */}
                        <section>
                            <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                                In Your Collection
                            </h2>
                            {searchResult.db_matches.length > 0 ? (
                                <div>
                                    <p style={{ color: 'var(--color-accent)', marginBottom: 'var(--spacing-sm)' }}>
                                        You already have this coin in your collection!
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {searchResult.db_matches.map(match => (
                                            <Link 
                                                key={match.id} 
                                                to={`/coins/${match.id}`}
                                                style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '10px', 
                                                    padding: '8px', 
                                                    background: 'rgba(255,255,255,0.05)', 
                                                    borderRadius: '8px',
                                                    textDecoration: 'none',
                                                    color: 'white'
                                                }}
                                            >
                                                {match.image_front_url && (
                                                    <img src={match.image_front_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                                )}
                                                <div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{match.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{match.year} • {match.country}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p style={{ color: 'var(--color-text-muted)' }}>
                                    No matches found in your collection.
                                </p>
                            )}
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}
