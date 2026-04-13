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

export async function identifyCoin(
    frontImage: File, 
    backImage: File,
    onProgress?: (message: string) => void
): Promise<ApiIdentificationResponse> {
    const formData = new FormData();
    formData.append('front_image', frontImage);
    formData.append('back_image', backImage);

    const response = await fetch('/api/coins/identify', {
        method: 'POST',
        headers: {
            'Accept': 'text/event-stream',
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
        throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let finalResult: ApiIdentificationResponse | null = null;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last partial line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.startsWith('data:')) {
                const dataString = line.slice(5).trim();
                if (!dataString) continue;

                try {
                    const data = JSON.parse(dataString);
                    if (data.message && onProgress) {
                        onProgress(data.message);
                    } else if (data.name || data.id) {
                        // Assuming completion if final fields are present
                        finalResult = data;
                    }
                } catch {
                    if (onProgress) {
                        onProgress(dataString);
                    }
                }
            }
        }
    }

    if (!finalResult) {
        throw new Error('Identification failed, no result found in stream');
    }

    return finalResult;
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
