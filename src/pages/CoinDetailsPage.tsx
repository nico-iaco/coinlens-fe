import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCollection } from '../context/CollectionContext';
import { reidentifyCoin } from '../services/coinService';

export default function CoinDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { coins, loading, updateCoin, deleteCoin } = useCollection();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [isReidentifying, setIsReidentifying] = useState(false);

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

    const handleDelete = async () => {
        if (!coin.id) return;
        if (confirm("Are you sure you want to delete this coin? This action cannot be undone.")) {
            try {
                await deleteCoin(coin.id);
                navigate('/');
            } catch (error) {
                console.error("Failed to delete coin", error);
                alert("Failed to delete coin");
            }
        }
    };

    const handleReidentify = async () => {
        if (!coin.id) return;
        setIsReidentifying(true);
        try {
            await reidentifyCoin(coin.id);
            alert("Coin re-identified successfully! Reloading...");
            window.location.reload();
        } catch (error) {
            console.error("Failed to re-identify coin", error);
            alert("Failed to re-identify coin");
        } finally {
            setIsReidentifying(false);
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
                            <button
                                onClick={handleReidentify}
                                disabled={isReidentifying}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: isReidentifying ? 'wait' : 'pointer',
                                    color: 'var(--color-accent)',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: isReidentifying ? 0.5 : 1
                                }}
                                title="Re-identify with AI"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                </svg>
                            </button>
                            <button
                                onClick={handleDelete}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-danger, #ff4d4f)',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title="Delete Coin"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
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
