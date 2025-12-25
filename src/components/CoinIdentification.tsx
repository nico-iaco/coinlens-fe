import { useEffect, useState } from 'react';

export default function CoinIdentification() {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
            <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto var(--spacing-lg)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    border: '4px solid var(--color-accent)',
                    borderRadius: '50%',
                    borderTopColor: 'transparent',
                    animation: 'spin 1s linear infinite'
                }} />
                <span style={{ fontSize: '2rem' }}>🤖</span>
            </div>
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
            <h2>Identifying Coin{dots}</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Analyzing intricate details...</p>
        </div>
    );
}
