// import { useEffect, useState } from "react";
// import { chainvault_backend } from "declarations/chainvault_backend";
// import { aes_gcm_encrypt, aes_gcm_decrypt } from "crypto-aes-gcm";
// import { decrypt, encrypt } from "../lib/crypto";

export function ChainVault() {
  // const [data, setData] = useState(null);
  // const [password, setPassword] = useState(null);

  // const message = "i will never let you go";

  // useEffect(() => {
  //   const fetchPassword = async () => {
  //     try {
  //       const password = await chainvault_backend.generateSeed();
  //       setPassword(password);
  //     } catch (error) {
  //       console.error("Error fetching password:", error);
  //     }
  //   };

  //   fetchPassword();
  // }, []);

  // useEffect(() => {
  //   if (!password) {
  //     return;
  //   }

  //   encrypt(message, password)
  //     .then(async (encrypted) => {
  //       console.log("Encrypted message:", encrypted);
  //       console.log("Decrypted message:", await decrypt(encrypted, password));
  //       setData(encrypted);
  //     })
  //     .catch((error) => {
  //       console.error("Error encrypting message:", error);
  //     });
  // }, [password]);

  return (
    <main>
      <h1>Chain Vault</h1>
      {/* <section>{JSON.stringify(data)}</section> */}
    </main>
  );
}

