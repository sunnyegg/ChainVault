import { aes_gcm_encrypt, aes_gcm_decrypt } from "crypto-aes-gcm";

export const encrypt = async (message: string, password: string) => {
  const encrypted = await aes_gcm_encrypt(message, password);
  return encrypted;
};

export const decrypt = async (encrypted: string, password: string) => {
  const decrypted = await aes_gcm_decrypt(encrypted, password);
  return decrypted;
};

export const generateRandomKey = (length: number) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
};

export const encodeBase64 = (data: string) => {
  const buffer = new TextEncoder().encode(data);
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

export const decodeBase64 = (data: string) => {
  const binaryString = atob(data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
};

export const hash256 = async (data: string) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};
