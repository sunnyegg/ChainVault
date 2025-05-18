import { aes_gcm_encrypt, aes_gcm_decrypt } from "crypto-aes-gcm";

export const encrypt = async (message, password) => {
  const encrypted = await aes_gcm_encrypt(message, password);
  return encrypted;
};

export const decrypt = async (encrypted, password) => {
  const decrypted = await aes_gcm_decrypt(encrypted, password);
  return decrypted;
};
