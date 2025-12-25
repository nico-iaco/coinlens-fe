import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCoinById, type ApiIdentificationResponse } from '../services/coinService';

export default function CoinDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [coin, setCoin] = useState<ApiIdentificationResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            getCoinById(id)
                .then(setCoin)
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="page container" style={{ textAlign: 'center' }}>Loading...</div>;
    if (error) return <div className="page container" style={{ textAlign: 'center', color: 'red' }}>Error: {error}</div>;
    if (!coin) return <div className="page container" style={{ textAlign: 'center' }}>Coin not found</div>;

    return (
        <div className="page container">
            <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
                ← Back to Catalog
            </Link>

            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', paddingBottom: 'var(--spacing-lg)', borderBottom: 'var(--glass-border)' }}>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>{coin.name}</h1>
                    <div style={{ color: 'var(--color-text-muted)' }}>{coin.country} • {coin.year}</div>
                </header>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-lg)',
                    margin: 'var(--spacing-xl) 0'
                }}>
                    {coin.image_front_url && (
                        <div>
                            <div style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-muted)', textAlign: 'center' }}>Front</div>
                            <img src={coin.image_front_url} alt="Front" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
                        </div>
                    )}
                    {coin.image_back_url && (
                        <div>
                            <div style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-muted)', textAlign: 'center' }}>Back</div>
                            <img src={coin.image_back_url} alt="Back" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
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
