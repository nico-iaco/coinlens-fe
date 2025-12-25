import { Link } from 'react-router-dom';
import { useCollection } from '../context/CollectionContext';

export default function HomePage() {
    const { coins } = useCollection();

    return (
        <div className="page container">
            <section style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <h1>Your Collection</h1>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto var(--spacing-lg)' }}>
                    Manage and organize your numismatic treasures with AI-powered identification.
                </p>

                <Link to="/add" className="premium-button">
                    <span>+</span> Add New Coin
                </Link>
            </section>

            {coins.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)', opacity: 0.5 }}>🪙</div>
                    <h3>No coins yet</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>Start building your digital catalog today.</p>
                </div>
            ) : (
                <div className="grid-catalog">
                    {coins.map(coin => (
                        <Link to={`/coins/${coin.id}`} key={coin.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s' }}>
                                {coin.imageBack && (
                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                        <img src={coin.imageBack} alt={coin.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <div style={{ padding: 'var(--spacing-md)' }}>
                                    <h3 style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: '1.2rem' }}>{coin.title}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                        <span>{coin.year}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
