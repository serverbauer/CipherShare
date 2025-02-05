const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '';

function getKeyBytes(): Uint8Array {
    const encoder = new TextEncoder();
    const keyBytes = encoder.encode(ENCRYPTION_KEY);

    const hashArray = Array.from(keyBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return new Uint8Array(
        hashArray.match(/.{2}/g)!
            .map(byte => parseInt(byte, 16))
            .slice(0, 32)
    );
}

export async function encrypt(text: string): Promise<string> {
    const keyBytes = getKeyBytes();
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const key = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
    );

    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    return btoa(String.fromCharCode(...combined));
}

export async function decrypt(encryptedText: string): Promise<string> {
    const keyBytes = getKeyBytes();
    const combined = new Uint8Array(
        atob(encryptedText).split('').map(char => char.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    const key = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encryptedData
    );

    return new TextDecoder().decode(decrypted);
}