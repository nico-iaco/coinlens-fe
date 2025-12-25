import { useRef, useState } from 'react';

interface ImageUploadAreaProps {
    label: string;
    onImageSelected: (file: File) => void;
    previewUrl?: string;
}

export default function ImageUploadArea({ label, onImageSelected, previewUrl }: ImageUploadAreaProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files?.[0]) {
            onImageSelected(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onImageSelected(e.target.files[0]);
        }
    };

    return (
        <div
            className={`glass-card ${isDragOver ? 'drag-over' : ''}`}
            style={{
                border: isDragOver ? '1px solid var(--color-accent)' : 'var(--glass-border)',
                textAlign: 'center',
                padding: 'var(--spacing-xl)',
                cursor: 'pointer',
                transition: 'var(--transition-medium)',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
        >
            <input
                type="file"
                ref={inputRef}
                onChange={handleChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt={`${label} Preview`}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.8
                    }}
                />
            ) : (
                <>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)', opacity: 0.7 }}>📷</div>
                    <h3 style={{ margin: 0, color: 'var(--color-text-main)' }}>{label}</h3>
                    <p style={{ margin: 'var(--spacing-xs) 0', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        Tap or drop file here
                    </p>
                </>
            )}

            {/* Overlay on hover/drag if preview exists */}
            {previewUrl && (
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 'var(--spacing-sm)',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    fontSize: '0.8rem'
                }}>
                    Tap to change
                </div>
            )}
        </div>
    );
}
