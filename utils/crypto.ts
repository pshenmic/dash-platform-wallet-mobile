/**
 * Cryptographic utilities for secure data storage
 * 
 * Uses password-based encryption with PBKDF2 key derivation
 * and AES-256-CBC encryption for sensitive data.
 * 
 * Using crypto-js for React Native compatibility
 */

import CryptoJS from 'crypto-js';
import * as Crypto from 'expo-crypto';

// Configuration
const PBKDF2_ITERATIONS = 10000; // Reduced for performance on mobile
const KEY_SIZE = 256 / 32; // 256 bits = 8 words (32-bit)
const SALT_LENGTH = 16; // 128 bits

/**
 * Generate random salt for PBKDF2
 */
export async function generateSalt(): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(SALT_LENGTH);
  // Convert Uint8Array to hex string without Buffer
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Derive encryption key from password using PBKDF2
 * 
 * @param password - User's password
 * @param salt - Unique salt (hex string)
 * @returns Derived key (hex string)
 */
export async function deriveKey(
  password: string,
  salt: string
): Promise<string> {
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: KEY_SIZE,
    iterations: PBKDF2_ITERATIONS,
    hasher: CryptoJS.algo.SHA256
  });
  
  return key.toString(CryptoJS.enc.Hex);
}

/**
 * Hash password for verification (not for encryption)
 * 
 * @param password - User's password
 * @param salt - Unique salt (hex string)
 * @returns Password hash (hex string)
 */
export async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
  return deriveKey(password, salt);
}

/**
 * Encrypt data with AES-256
 *
 * @param plaintext - Data to encrypt
 * @param key - Encryption key (hex string)
 * @returns Encrypted data (includes IV)
 */
export async function encrypt(
  plaintext: string,
  key: string
): Promise<{ ciphertext: string; iv: string }> {
  // Generate random Initialization Vector
  const ivBytes = await Crypto.getRandomBytesAsync(16);
  // Convert Uint8Array to hex string without Buffer
  const iv = Array.from(ivBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Convert key to WordArray
  const keyWordArray = CryptoJS.enc.Hex.parse(key);
  const ivWordArray = CryptoJS.enc.Hex.parse(iv);
  
  // Encrypt with AES-256-CBC
  const encrypted = CryptoJS.AES.encrypt(plaintext, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return {
    ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Hex),
    iv
  };
}

/**
 * Decrypt data with AES-256
 * 
 * @param ciphertext - Encrypted data (hex string)
 * @param key - Encryption key (hex string)
 * @param iv - Initialization vector (hex string)
 * @returns Decrypted plaintext
 * @throws Error if decryption fails or data is corrupted
 */
export async function decrypt(
  ciphertext: string,
  key: string,
  iv: string
): Promise<string> {
  try {
    // Convert to WordArrays
    const keyWordArray = CryptoJS.enc.Hex.parse(key);
    const ivWordArray = CryptoJS.enc.Hex.parse(iv);
    const ciphertextWordArray = CryptoJS.enc.Hex.parse(ciphertext);
    
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: ciphertextWordArray
    });
    
    const decrypted = CryptoJS.AES.decrypt(cipherParams, keyWordArray, {
      iv: ivWordArray,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    
    // Validate decryption - empty result means wrong key
    if (!result || result.length === 0) {
      throw new Error('Decryption failed: wrong key or corrupted data');
    }
    
    return result;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Malformed UTF-8')) {
      throw new Error('Decryption failed: invalid password or corrupted data');
    }
    throw error;
  }
}

/**
 * Verify password against stored hash
 * 
 * @param password - Password to verify
 * @param storedHash - Stored password hash
 * @param salt - Salt used for hashing
 * @returns True if password is correct
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const hash = await hashPassword(password, salt);
  return hash === storedHash;
}
