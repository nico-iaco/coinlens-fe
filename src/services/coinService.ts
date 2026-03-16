export interface ApiIdentificationResponse {
    id: string;
    name: string;
    description: string;
    year: string;
    country: string;
    universal_id?: string;
    image_front_url?: string;
    image_back_url?: string;
    created_at?: string;
}

export interface ApiSearchResponse {
    ai_analysis: {
        name: string;
        country: string;
        year: string;
        universal_id: string;
    };
    db_matches: ApiIdentificationResponse[];
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

export async function deleteCoin(id: string): Promise<void> {
    const response = await fetch(`/api/coins/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`API Delete Error: ${response.status}`);
    }
}

export async function addCoinManual(data: {
    name: string;
    description: string;
    year: string;
    country: string;
    universal_id?: string;
    front_image: File;
    back_image: File;
}): Promise<ApiIdentificationResponse> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('year', data.year);
    formData.append('country', data.country);
    if (data.universal_id) formData.append('universal_id', data.universal_id);
    formData.append('front_image', data.front_image);
    formData.append('back_image', data.back_image);

    const response = await fetch('/api/coins', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`API Manual Add Error: ${response.status}`);
    }

    return response.json();
}

export async function reidentifyCoin(id: string): Promise<ApiIdentificationResponse> {
    const response = await fetch(`/api/coins/${id}/identify`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error(`API Re-identify Error: ${response.status}`);
    }

    return response.json();
}

export async function searchCoin(reverseImage: File): Promise<ApiSearchResponse> {
    const formData = new FormData();
    formData.append('reverse_image', reverseImage);

    const response = await fetch('/api/coins/search', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`API Search Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
