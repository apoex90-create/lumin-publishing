import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

let cachedKey: Buffer | null = null;

function resolveEncryptionKey(): Buffer {
  const raw = process.env.PII_ENCRYPTION_KEY;
  if (raw) {
    const key = Buffer.from(raw, 'hex');
    if (key.length !== 32) {
      throw new Error('PII_ENCRYPTION_KEY must be a 32-byte key encoded as a 64-character hex string.');
    }
    return key;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('PII_ENCRYPTION_KEY environment variable must be set in production.');
  }
  console.warn('[lumin] PII_ENCRYPTION_KEY is not set — using an insecure development-only key. Set PII_ENCRYPTION_KEY before deploying.');
  return crypto.createHash('sha256').update('lumin-dev-only-pii-key').digest();
}

function getEncryptionKey(): Buffer {
  if (!cachedKey) cachedKey = resolveEncryptionKey();
  return cachedKey;
}

/** Encrypts a UTF-8 string for storage. Returns "iv:authTag:ciphertext" (all hex). */
export function encryptPII(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${ciphertext.toString('hex')}`;
}

/** Decrypts a value produced by encryptPII. Returns null if missing, empty, or malformed. */
export function decryptPII(stored: string | null | undefined): string | null {
  if (!stored) return null;
  const parts = stored.split(':');
  if (parts.length !== 3) return null;
  try {
    const [ivHex, authTagHex, ciphertextHex] = parts;
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    const plaintext = Buffer.concat([decipher.update(Buffer.from(ciphertextHex, 'hex')), decipher.final()]);
    return plaintext.toString('utf8');
  } catch {
    return null;
  }
}
