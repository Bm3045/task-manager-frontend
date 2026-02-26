import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'my_32_character_encryption_key_123';

export const decryptData = (encryptedObject) => {
  if (!encryptedObject || !encryptedObject.iv || !encryptedObject.encryptedData) {
    return encryptedObject;
  }

  try {
    const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY.padEnd(32).slice(0, 32));
    const iv = CryptoJS.enc.Hex.parse(encryptedObject.iv);
    const encrypted = CryptoJS.enc.Hex.parse(encryptedObject.encryptedData);
    
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encrypted },
      key,
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedObject;
  }
};