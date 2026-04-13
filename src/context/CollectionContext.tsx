import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { getCoins, updateCoinName, deleteCoin as deleteCoinApi, type ApiIdentificationResponse } from '../services/coinService';

// Map API response to our internal Coin type
export interface Coin extends ApiIdentificationResponse {
    // Aliases to handle possible mismatches during transition
    title: string;
    imageFront?: string;
    imageBack?: string;
    dateAdded: number;
    universal_id?: string;
}

export interface CoinFilters {
    name: string;
    country: string;
    year: string;
}

interface CollectionContextType {
    coins: Coin[];
    filteredCoins: Coin[];
    filters: CoinFilters;
    hasActiveFilters: boolean;
    loading: boolean;
    refreshCoins: () => void;
    setFilter: (partial: Partial<CoinFilters>) => void;
    clearFilters: () => void;
    addCoin: (coinData?: unknown) => void; // Legacy support
    updateCoin: (id: string, name: string) => Promise<void>;
    deleteCoin: (id: string) => Promise<void>;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: ReactNode }) {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState(0);
    const [filters, setFilters] = useState<CoinFilters>({ name: '', country: '', year: '' });
    const [debouncedName, setDebouncedName] = useState('');

    useEffect(() => {
        getCoins()
            .then(apiCoins => {
                // Map API format to Internal format
                const mapped: Coin[] = apiCoins.map(ac => ({
                    ...ac,
                    title: ac.name, // Mapping
                    imageFront: ac.image_front_url,
                    imageBack: ac.image_back_url,
                    dateAdded: ac.created_at ? new Date(ac.created_at).getTime() : Date.now(),
                    universal_id: ac.universal_id
                }));
                setCoins(mapped);
            })
            .catch(err => console.error("Failed to fetch coins", err))
            .finally(() => setLoading(false));
    }, [trigger]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedName(filters.name.trim().toLowerCase());
        }, 300);

        return () => clearTimeout(timeout);
    }, [filters.name]);

    const normalizedCountryFilter = filters.country.trim().toLowerCase();
    const normalizedYearFilter = filters.year.trim().toLowerCase();

    const filteredCoins = useMemo(() => {
        return coins.filter((coin) => {
            const coinName = (coin.title || coin.name || '').toLowerCase();
            const coinCountry = (coin.country || '').trim().toLowerCase();
            const coinYear = (coin.year || '').trim().toLowerCase();

            if (debouncedName && !coinName.includes(debouncedName)) {
                return false;
            }

            if (normalizedCountryFilter && coinCountry !== normalizedCountryFilter) {
                return false;
            }

            if (normalizedYearFilter && coinYear !== normalizedYearFilter) {
                return false;
            }

            return true;
        });
    }, [coins, debouncedName, normalizedCountryFilter, normalizedYearFilter]);

    const hasActiveFilters = Boolean(
        filters.name.trim() || filters.country.trim() || filters.year.trim()
    );

    const refreshCoins = () => {
        setLoading(true);
        setTrigger(t => t + 1);
    };

    const setFilter = (partial: Partial<CoinFilters>) => {
        setFilters(prev => ({ ...prev, ...partial }));
    };

    const clearFilters = () => {
        setFilters({ name: '', country: '', year: '' });
        setDebouncedName('');
    };

    // Deprecated/Modified: addCoin is now handled by the API flow,
    // but we keep this stub to trigger a refresh for now.
    const addCoin = () => {
        // In a real app, 'add' happens via API, then we refresh.
        // Since UploadPage now creates the coin via API (implied), we just refresh.
        refreshCoins();
    };

    const updateCoin = async (id: string, name: string) => {
        await updateCoinName(id, name);
        refreshCoins();
    };

    const deleteCoin = async (id: string) => {
        await deleteCoinApi(id);
        setCoins(prev => prev.filter(c => c.id !== id));
    };

    return (
        <CollectionContext.Provider
            value={{
                coins,
                filteredCoins,
                filters,
                hasActiveFilters,
                loading,
                refreshCoins,
                setFilter,
                clearFilters,
                addCoin,
                updateCoin,
                deleteCoin
            }}
        >
            {children}
        </CollectionContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCollection() {
    const context = useContext(CollectionContext);
    if (context === undefined) {
        throw new Error('useCollection must be used within a CollectionProvider');
    }
    return context;
}
