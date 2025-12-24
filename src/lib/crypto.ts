export async function decryptFromDTN(d: string, t: string, n: string) {
  const toBytes = (str: string) =>
    Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

  const keyBytes = toBytes(d).slice(0, 16);
  const cipherBytes = toBytes(d).slice(16);
  const tagBytes = toBytes(t);
  const iv = toBytes(n);

  const key = await crypto.subtle.importKey(
    "raw", 
    keyBytes, 
    "AES-GCM", 
    false, 
    ["decrypt"]
);

  const encrypted = new Uint8Array([...cipherBytes, ...tagBytes]);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}
