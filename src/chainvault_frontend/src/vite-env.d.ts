/// <reference types="vite/client" />
declare module "crypto-aes-gcm" {
  export function aes_gcm_encrypt(
    message: string,
    password: string
  ): Promise<string>;
  export function aes_gcm_decrypt(
    encrypted: string,
    password: string
  ): Promise<string>;
}
