export interface ApiIdentificationResponse {
    id: string;
    name: string;
    description: string;
    year: string;
    country: string;
    image_front_url?: string;
    image_back_url?: string;
    created_at?: string;
}

export async function getCoins(): Promise<ApiIdentificationResponse[]> {
    const response = await fetch('/api/coins');
    if (!response.ok) {
        throw new Error(`API List Error: ${response.status}`);
    }
    return response.json();
}

export async function getCoinById(id: string): Promise<ApiIdentificationResponse> {
    const response = await fetch(`/api/coins/${id}`);
    if (!response.ok) {
        throw new Error(`API Detail Error: ${response.status}`);
    }
    return response.json();
}

export async function identifyCoin(frontImage: File, backImage: File): Promise<ApiIdentificationResponse> {
    const formData = new FormData();
    formData.append('front_image', frontImage);
    formData.append('back_image', backImage);

    const response = await fetch('/api/coins/identify', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

export async function updateCoinName(id: string, name: string): Promise<ApiIdentificationResponse> {
    const response = await fetch(`/api/coins/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        throw new Error(`API Update Error: ${response.status}`);
    }

    return response.json();
}
