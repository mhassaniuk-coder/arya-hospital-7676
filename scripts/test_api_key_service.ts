import { apiKeyService } from '../services/apiKeyService';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; }
    };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Test 1: Generate Key
console.log('Test 1: Generate Key');
const key1 = apiKeyService.generateKey({ name: 'Test Key 1', rateLimit: 'standard' });
console.log('Generated:', key1.key);

if (apiKeyService.listKeys().length !== 1) throw new Error('Failed to list keys');
if (apiKeyService.listKeys()[0].id !== key1.id) throw new Error('Key ID mismatch');

// Test 2: Validate Key
console.log('Test 2: Validate Key');
const isValid = apiKeyService.validateKey(key1.key);
if (!isValid) throw new Error('Failed to validate active key');
console.log('Validation passed');

// Test 3: Revoke Key
console.log('Test 3: Revoke Key');
apiKeyService.revokeKey(key1.id);
const revokedKey = apiKeyService.listKeys().find(k => k.id === key1.id);
if (revokedKey?.status !== 'revoked') throw new Error('Failed to revoke key');

const isValidRevoked = apiKeyService.validateKey(key1.key);
if (isValidRevoked) throw new Error('Revoked key should not be valid');
console.log('Revocation passed');

// Test 4: IP Whitelist
console.log('Test 4: IP Whitelist');
const key2 = apiKeyService.generateKey({ name: 'IP Key', ipWhitelist: ['192.168.1.1'] });
if (apiKeyService.validateKey(key2.key, { ip: '10.0.0.1' })) throw new Error('IP restriction failed (should fail)');
if (!apiKeyService.validateKey(key2.key, { ip: '192.168.1.1' })) throw new Error('IP restriction failed (should pass)');
console.log('IP Whitelist passed');

console.log('ALL TESTS PASSED');
