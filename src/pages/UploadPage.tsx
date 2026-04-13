import { useState } from 'react';
import ImageUploadArea from '../components/ImageUploadArea';
import CoinIdentification from '../components/CoinIdentification';
import CoinDetails from '../components/CoinDetails';
import { useCollection } from '../context/CollectionContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { identifyCoin, addCoinManual, type ApiIdentificationResponse } from '../services/coinService';

// Adapter type for the view
interface IdentificationResult extends ApiIdentificationResponse {
    title: string;
    value: string;
    imageFront?: string;
    imageBack?: string;
}

export default function UploadPage() {
    const [frontImage, setFrontImage] = useState<File | null>(null);
    const [backImage, setBackImage] = useState<File | null>(null);
    const [frontPreview, setFrontPreview] = useState<string>();
    const [backPreview, setBackPreview] = useState<string>();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzeStatus, setAnalyzeStatus] = useState("Analyzing intricate details...");

    const [result, setResult] = useState<IdentificationResult | null>(null);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualForm, setManualForm] = useState({
        name: '',
        description: '',
        year: '',
        country: '',
        universal_id: ''
    });

    const { addCoin, refreshCoins } = useCollection();
    const navigate = useNavigate();
    const location = useLocation();

    // Handle pre-fill data from search
    useEffect(() => {
        const prefill = location.state?.prefill;
        if (prefill) {
            setManualForm({
                name: prefill.name || '',
                description: prefill.description || '',
                year: prefill.year || '',
                country: prefill.country || '',
                universal_id: prefill.universal_id || ''
            });
            if (prefill.imageBackPreview) setBackPreview(prefill.imageBackPreview);
            if (prefill.imageBackFile) setBackImage(prefill.imageBackFile);
            setShowManualEntry(true);
        }
    }, [location.state]);

    const handleImageSelect = (side: 'front' | 'back') => (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (side === 'front') {
                setFrontImage(file);
                setFrontPreview(result);
            } else {
                setBackImage(file);
                setBackPreview(result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAnalyze = async () => {
        if (!frontImage || !backImage) return;
        setIsAnalyzing(true);
        setAnalyzeStatus("Uploading images...");

        try {
            const data = await identifyCoin(frontImage, backImage, (msg) => {
                setAnalyzeStatus(msg);
            });
            setResult({
                ...data,
                title: data.name, // Map API 'name' to UI 'title'
                value: "N/A", // API doesn't return value yet
                imageFront: frontPreview,
                imageBack: backPreview
            });
        } catch (error) {
            console.error("Identification failed", error);
            if (confirm("Identification failed. Would you like to add the coin manually?")) {
                setShowManualEntry(true);
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = () => {
        if (result) {
            addCoin({
                title: result.name, // API returns name
                description: result.description,
                year: result.year,
                country: result.country,
                value: result.value,
                imageFront: result.imageFront,
                imageBack: result.imageBack
            });
            navigate('/');
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!frontImage || !backImage) return;

        try {
            await addCoinManual({
                ...manualForm,
                front_image: frontImage,
                back_image: backImage
            });
            refreshCoins();
            navigate('/');
        } catch (error) {
            console.error("Manual add failed", error);
            alert("Failed to add coin manually.");
        }
    };

    if (isAnalyzing) {
        return (
            <div className="page container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CoinIdentification status={analyzeStatus} />
            </div>
        );
    }

    if (showManualEntry) {
        return (
            <div className="page container">
                <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>Manual Entry</h2>
                    <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>
                            {frontPreview && <img src={frontPreview} alt="Front" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />}
                            {backPreview && <img src={backPreview} alt="Back" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-muted)' }}>Name</label>
                            <input
                                type="text"
                                required
                                value={manualForm.name}
                                onChange={e => setManualForm(prev => ({ ...prev, name: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-muted)' }}>Year</label>
                                <input
                                    type="text"
                                    required
                                    value={manualForm.year}
                                    onChange={e => setManualForm(prev => ({ ...prev, year: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-muted)' }}>Country</label>
                                <input
                                    type="text"
                                    required
                                    value={manualForm.country}
                                    onChange={e => setManualForm(prev => ({ ...prev, country: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-muted)' }}>Universal ID</label>
                            <input
                                type="text"
                                value={manualForm.universal_id}
                                onChange={e => setManualForm(prev => ({ ...prev, universal_id: e.target.value }))}
                                placeholder="e.g. KM# 123"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-muted)' }}>Description</label>
                            <textarea
                                value={manualForm.description}
                                onChange={e => setManualForm(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                            <button
                                type="button"
                                className="premium-button secondary"
                                onClick={() => setShowManualEntry(false)}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="premium-button"
                                style={{ flex: 1 }}
                            >
                                Add manual
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (result) {
        return <CoinDetails data={result} onSave={handleSave} />;
    }

    return (
        <div className="page container">
            <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                <h1>Identify Your Coin</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Upload clear photos of both sides</p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-2xl)'
            }}>
                <ImageUploadArea
                    label="Front Side"
                    onImageSelected={handleImageSelect('front')}
                    previewUrl={frontPreview}
                />
                <ImageUploadArea
                    label="Back Side"
                    onImageSelected={handleImageSelect('back')}
                    previewUrl={backPreview}
                />
            </div>

            <div style={{ textAlign: 'center' }}>
                <button
                    className="premium-button"
                    disabled={!frontImage || !backImage}
                    onClick={handleAnalyze}
                    style={{ opacity: (!frontImage || !backImage) ? 0.5 : 1 }}
                >
                    Analyze Coin ✨
                </button>
            </div>
        </div>
    );
}
