import crypto from "crypto";

export const encrypt = (text, secretKey) => {
  const iv = crypto.randomBytes(16); // Generate a random IV (16 bytes)
  const key = crypto.createHash("sha256").update(secretKey).digest(); // Ensure 32-byte key

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted; // Store IV with encrypted data
};

export const decrypt = (encryptedText, secretKey) => {
    const [ivHex, encryptedHex] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const key = crypto.createHash("sha256").update(secretKey).digest();
  
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
  
    return decrypted;
  };