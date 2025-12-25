import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getCoins, type ApiIdentificationResponse } from '../services/coinService';

// Map API response to our internal Coin type
export interface Coin extends ApiIdentificationResponse {
    // Aliases to handle possible mismatches during transition
    title: string;
    imageFront?: string;
    imageBack?: string;
    dateAdded: number;
}

interface CollectionContextType {
    coins: Coin[];
    loading: boolean;
    refreshCoins: () => void;
    addCoin: (coinData: unknown) => void; // Legacy support
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: ReactNode }) {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        setLoading(true);
        getCoins()
            .then(apiCoins => {
                // Map API format to Internal format
                const mapped: Coin[] = apiCoins.map(ac => ({
                    ...ac,
                    title: ac.name, // Mapping
                    imageFront: ac.image_front_url,
                    imageBack: ac.image_back_url,
                    dateAdded: ac.created_at ? new Date(ac.created_at).getTime() : Date.now()
                }));
                setCoins(mapped);
            })
            .catch(err => console.error("Failed to fetch coins", err))
            .finally(() => setLoading(false));
    }, [trigger]);

    const refreshCoins = () => setTrigger(t => t + 1);

    // Deprecated/Modified: addCoin is now handled by the API flow,
    // but we keep this stub to trigger a refresh for now.
    const addCoin = (/* coinData */) => {
        // In a real app, 'add' happens via API, then we refresh.
        // Since UploadPage now creates the coin via API (implied), we just refresh.
        refreshCoins();
    };

    return (
        <CollectionContext.Provider value={{ coins, loading, refreshCoins, addCoin }}>
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
