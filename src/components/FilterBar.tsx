import type { CoinFilters } from '../context/CollectionContext';

interface FilterBarProps {
    filters: CoinFilters;
    countries: string[];
    years: string[];
    hasActiveFilters: boolean;
    resultCount: number;
    onFilterChange: (partial: Partial<CoinFilters>) => void;
    onClear: () => void;
}

export default function FilterBar({
    filters,
    countries,
    years,
    hasActiveFilters,
    resultCount,
    onFilterChange,
    onClear
}: FilterBarProps) {
    return (
        <section className="glass-card filter-bar" aria-label="Coin filters">
            <div className="filter-bar-header">
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Quick Filters</h2>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    {resultCount} result{resultCount === 1 ? '' : 's'}
                </div>
            </div>

            <div className="filter-grid">
                <label className="filter-field">
                    <span>Name</span>
                    <input
                        type="text"
                        value={filters.name}
                        placeholder="e.g. 2 Euro"
                        onChange={(e) => onFilterChange({ name: e.target.value })}
                    />
                </label>

                <label className="filter-field">
                    <span>Country</span>
                    <select
                        value={filters.country}
                        onChange={(e) => onFilterChange({ country: e.target.value })}
                    >
                        <option value="">All countries</option>
                        {countries.map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="filter-field">
                    <span>Year</span>
                    <select
                        value={filters.year}
                        onChange={(e) => onFilterChange({ year: e.target.value })}
                    >
                        <option value="">All years</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="filter-actions">
                <button
                    type="button"
                    className="premium-button secondary"
                    onClick={onClear}
                    disabled={!hasActiveFilters}
                    style={{ opacity: hasActiveFilters ? 1 : 0.5 }}
                >
                    Clear filters
                </button>
            </div>
        </section>
    );
}
