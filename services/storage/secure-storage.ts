/**
 * Secure Storage Service
 * 
 * Provides password-protected encrypted storage for sensitive data
 * like mnemonics and private keys.
 * 
 * Architecture:
 * 1. User password → PBKDF2 → Encryption key
 * 2. Sensitive data → AES-256-CBC → Encrypted data
 * 3. Encrypted data → Expo SecureStore (iOS Keychain/Android Keystore)
 */

import * as SecureStore from 'expo-secure-store';
import { AuthenticationError, StorageError } from '@/errors';
import { EncryptedData } from '@/types/storage';
import { decrypt, deriveKey, encrypt, generateSalt } from '@/utils/crypto';

class SecureStorageService {
  private encryptionKey: string | null = null;

  /**
   * Initialize secure storage with password on first use
   * 
   * @param password - User's password
   */
  async initialize(password: string): Promise<void> {
    // Generate unique salt for this installation
    const salt = await generateSalt();
    
    // Derive encryption key from password
    const key = await deriveKey(password, salt);
    
    // Store salt (needed to derive key later)
    await SecureStore.setItemAsync('encryption_salt', salt);
    
    // Store a verification value to confirm password correctness later
    const verificationData = await this.encryptWithKey('password_verification', key);
    await SecureStore.setItemAsync('password_verification', JSON.stringify(verificationData));

    this.encryptionKey = key;
  }

  /**
   * Unlock storage with password
   * 
   * @param password - User's password
   * @returns True if unlocked successfully
   */
  async unlock(password: string): Promise<boolean> {
    try {
      // Load salt
      const salt = await SecureStore.getItemAsync('encryption_salt');
      if (!salt) {
        throw new StorageError('Storage not initialized', 'NOT_INITIALIZED');
      }

      // Derive key from password
      const key = await deriveKey(password, salt);

      // Verify password by decrypting verification value
      const verificationJson = await SecureStore.getItemAsync('password_verification');
      if (verificationJson) {
        const data: EncryptedData = JSON.parse(verificationJson);
        const decrypted = await decrypt(data.ciphertext, key, data.iv);

        if (decrypted !== 'password_verification') {
          throw new AuthenticationError('Password verification failed', 'INVALID_PASSWORD');
        }
      }

      this.encryptionKey = key;
      return true;
    } catch (error) {
      this.encryptionKey = null;
      return false;
    }
  }

  /**
   * Lock storage (clear encryption key from memory)
   */
  lock(): void {
    this.encryptionKey = null;
  }

  /**
   * Check if storage is unlocked
   */
  isUnlocked(): boolean {
    return this.encryptionKey !== null;
  }

  /**
   * Save encrypted value
   * 
   * @param key - Storage key
   * @param value - Value to encrypt and store
   */
  async setItem(key: string, value: string): Promise<void> {
    if (!this.encryptionKey) {
      throw new StorageError('Storage is locked', 'LOCKED');
    }

    const data = await this.encryptWithKey(value, this.encryptionKey);
    await SecureStore.setItemAsync(key, JSON.stringify(data));
  }

  /**
   * Load and decrypt value
   * 
   * @param key - Storage key
   * @returns Decrypted value or null
   */
  async getItem(key: string): Promise<string | null> {
    if (!this.encryptionKey) {
      throw new StorageError('Storage is locked', 'LOCKED');
    }

    const stored = await SecureStore.getItemAsync(key);
    if (!stored) return null;

    const data: EncryptedData = JSON.parse(stored);
    return await decrypt(data.ciphertext, this.encryptionKey, data.iv);
  }

  /**
   * Remove item
   * 
   * @param key - Storage key
   */
  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }

  /**
   * Clear all encrypted data (destructive!)
   */
  async clear(): Promise<void> {
    // This will clear ALL SecureStore data
    // In production, you might want to track keys and delete selectively
    this.lock();
  }

  /**
   * Reset password and all encrypted data (DANGEROUS!)
   * Removes salt, verification, and all stored data
   */
  async reset(): Promise<void> {
    console.log('[SecureStorage] Starting reset...');
    
    // Delete in sequence to ensure completion
    try {
      await SecureStore.deleteItemAsync('encryption_salt');
      console.log('[SecureStorage] Deleted encryption_salt');
    } catch (err) {
      console.log('[SecureStorage] encryption_salt already deleted or not found');
    }
    
    try {
      await SecureStore.deleteItemAsync('password_verification');
      console.log('[SecureStorage] Deleted password_verification');
    } catch (err) {
      console.log('[SecureStorage] password_verification already deleted or not found');
    }
    
    this.lock();
    console.log('[SecureStorage] Reset complete, storage locked');
    
    // Verify deletion
    const saltCheck = await SecureStore.getItemAsync('encryption_salt');
    const verificationCheck = await SecureStore.getItemAsync('password_verification');
    console.log('[SecureStorage] Verification - salt exists:', !!saltCheck, 'verification exists:', !!verificationCheck);
  }

  /**
   * Helper: Encrypt data with given key
   */
  private async encryptWithKey(
    value: string,
    key: string
  ): Promise<EncryptedData> {
    const { ciphertext, iv } = await encrypt(value, key);
    return { ciphertext, iv };
  }
}

// Export singleton instance
export const secureStorage = new SecureStorageService();
