

interface CoinDetailsProps {
    data: {
        title: string;
        description?: string;
        year: string;
        country: string;
        value: string;
        imageUrl?: string;
    };
    onSave: () => void;
}

export default function CoinDetails({ data, onSave }: CoinDetailsProps) {
    return (
        <div className="page container">
            <div className="glass-card" style={{ display: 'grid', gap: 'var(--spacing-lg)', maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', borderBottom: 'var(--glass-border)', paddingBottom: 'var(--spacing-md)' }}>
                    <span style={{
                        background: 'var(--color-accent)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        marginBottom: 'var(--spacing-sm)',
                        display: 'inline-block'
                    }}>
                        Match Found
                    </span>
                    <h1 style={{ marginBottom: 0 }}>{data.title}</h1>
                    {data.description && (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 'var(--spacing-sm) 0' }}>
                            {data.description}
                        </p>
                    )}
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                    {/* Image would go here if returned by API or passed down */}
                    <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                        <div>
                            <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Year</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: 500 }}>{data.year}</div>
                        </div>
                        <div>
                            <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Country</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: 500 }}>{data.country}</div>
                        </div>
                        <div>
                            <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Estimated Value</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--color-accent)' }}>{data.value}</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', marginTop: 'var(--spacing-lg)' }}>
                    <button className="premium-button secondary" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                    <button className="premium-button" onClick={onSave}>
                        Save to Catalog
                    </button>
                </div>
            </div>
        </div>
    );
}
