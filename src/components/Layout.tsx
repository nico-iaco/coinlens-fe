import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="app-layout">
            <header style={{
                padding: 'var(--spacing-md) 0',
                borderBottom: 'var(--glass-border)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(0,0,0,0.2)'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                        <img src="/logo.svg" alt="CoinLens Logo" style={{ height: '40px', width: '40px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>CoinLens</span>
                    </Link>
                    <nav style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                        <Link to="/search" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Search</Link>
                        <Link to="/add" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Add Coin</Link>
                    </nav>
                </div>
            </header>

            <main>
                <Outlet />
            </main>

            <footer style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <div className="container">
                    &copy; {new Date().getFullYear()} CoinLens. Your Premium Collection.
                </div>
            </footer>
        </div>
    );
}
