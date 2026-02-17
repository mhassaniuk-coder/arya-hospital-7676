import { v4 as uuidv4 } from 'uuid';

export interface ApiKey {
    id: string;
    key: string;
    name: string;
    createdAt: string;
    expiresAt?: string; // ISO date string
    ipWhitelist?: string[];
    rateLimit: 'standard' | 'unlimited';
    status: 'active' | 'revoked';
    lastUsed?: string;
}

const STORAGE_KEY = 'nexus_api_keys';

class ApiKeyService {
    private getKeys(): ApiKey[] {
        const keys = localStorage.getItem(STORAGE_KEY);
        return keys ? JSON.parse(keys) : [];
    }

    private saveKeys(keys: ApiKey[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    }

    generateKey(options: {
        name: string;
        expiresAt?: string;
        ipWhitelist?: string[];
        rateLimit?: 'standard' | 'unlimited';
    }): ApiKey {
        const keys = this.getKeys();

        // Generate a secure-looking random key
        const prefix = 'nhms_sk_live_';
        const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(24)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        const newKey: ApiKey = {
            id: uuidv4(),
            key: `${prefix}${randomPart}`,
            name: options.name,
            createdAt: new Date().toISOString(),
            expiresAt: options.expiresAt,
            ipWhitelist: options.ipWhitelist,
            rateLimit: options.rateLimit || 'standard',
            status: 'active'
        };

        keys.push(newKey);
        this.saveKeys(keys);
        return newKey;
    }

    listKeys(): ApiKey[] {
        return this.getKeys().sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    revokeKey(id: string): void {
        const keys = this.getKeys();
        const updatedKeys = keys.map(k =>
            k.id === id ? { ...k, status: 'revoked' as const } : k
        );
        this.saveKeys(updatedKeys);
    }

    updateKey(id: string, updates: Partial<Pick<ApiKey, 'name' | 'ipWhitelist' | 'expiresAt' | 'rateLimit'>>): ApiKey | null {
        const keys = this.getKeys();
        const index = keys.findIndex(k => k.id === id);
        if (index === -1) return null;

        keys[index] = { ...keys[index], ...updates };
        this.saveKeys(keys);
        return keys[index];
    }

    // Simulate validation
    validateKey(keyString: string, context?: { ip?: string }): boolean {
        const keys = this.getKeys();
        const key = keys.find(k => k.key === keyString);

        if (!key || key.status === 'revoked') return false;

        if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
            return false; // Expired
        }

        if (key.ipWhitelist && key.ipWhitelist.length > 0 && context?.ip) {
            if (!key.ipWhitelist.includes(context.ip)) {
                return false; // IP not allowed
            }
        }

        // Update last used
        key.lastUsed = new Date().toISOString();
        this.saveKeys(keys);

        return true;
    }
}

export const apiKeyService = new ApiKeyService();
