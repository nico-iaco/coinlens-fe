import { useState } from 'react';
import ImageUploadArea from '../components/ImageUploadArea';
import CoinIdentification from '../components/CoinIdentification';
import CoinDetails from '../components/CoinDetails';
import { useCollection } from '../context/CollectionContext';
import { useNavigate } from 'react-router-dom';

import { identifyCoin, type ApiIdentificationResponse } from '../services/coinService';

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

    const [result, setResult] = useState<IdentificationResult | null>(null);
    const { addCoin } = useCollection();
    const navigate = useNavigate();

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

        try {
            const data = await identifyCoin(frontImage, backImage);
            setResult({
                ...data,
                title: data.name, // Map API 'name' to UI 'title'
                value: "N/A", // API doesn't return value yet
                imageFront: frontPreview,
                imageBack: backPreview
            });
        } catch (error) {
            console.error("Identification failed", error);
            alert("Identification failed. Please try again.");
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

    if (isAnalyzing) {
        return (
            <div className="page container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CoinIdentification />
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
