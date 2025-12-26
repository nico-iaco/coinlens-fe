import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollection } from '../context/CollectionContext';

export default function CoinDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { coins, loading, updateCoin } = useCollection();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');

    // Find the coin directly from the loaded collection
    const coin = coins.find(c => c.id === id);

    if (loading) return <div className="page container" style={{ textAlign: 'center' }}>Loading...</div>;
    if (!coin) return <div className="page container" style={{ textAlign: 'center' }}>Coin not found</div>;

    const startEditing = () => {
        setEditName(coin.title);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!coin.id) return; // Should not happen
        try {
            await updateCoin(coin.id, editName);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update coin name", error);
            alert("Failed to update coin name");
        }
    };

    return (
        <div className="page container">
            <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
                ← Back to Catalog
            </Link>

            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', paddingBottom: 'var(--spacing-lg)', borderBottom: 'var(--glass-border)' }}>
                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'white',
                                    borderRadius: '8px',
                                    padding: '4px 12px',
                                    width: '100%',
                                    maxWidth: '400px'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="premium-button" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={handleSave}>Save</button>
                                <button className="premium-button secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: 'var(--spacing-sm)' }}>
                            <h1 style={{ marginBottom: 0 }}>{coin.title}</h1>
                            <button
                                onClick={startEditing}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-text-muted)',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title="Edit Name"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                        </div>
                    )}
                    <div style={{ color: 'var(--color-text-muted)' }}>{coin.country} • {coin.year}</div>
                </header>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-lg)',
                    margin: 'var(--spacing-xl) 0'
                }}>
                    {coin.imageFront && (
                        <div>
                            <div style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-muted)', textAlign: 'center' }}>Front</div>
                            <img src={coin.imageFront} alt="Front" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
                        </div>
                    )}
                    {coin.imageBack && (
                        <div>
                            <div style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-muted)', textAlign: 'center' }}>Back</div>
                            <img src={coin.imageBack} alt="Back" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
                        </div>
                    )}
                </div>

                {coin.description && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)' }}>
                        <h3 style={{ marginTop: 0 }}>Description</h3>
                        <p style={{ lineHeight: 1.6, color: 'var(--color-text-muted)' }}>{coin.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
