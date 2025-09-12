import crypto, {AES} from 'react-native-crypto-js';

let prime = 15485863;
let generator = 5;
// Example usage
const generateSymmetricKey = () => {
  return '1234567890'; // 256 bits
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function powMod(base, exponent, modulus) {
  if (modulus === 1) return 0;
  let result = 1;
  base = base % modulus;
  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }
  return result;
}

const encryptWithPublicKey = async (data, key) => {
  let encryptFormat = AES.encrypt(data, key).toString();

  return encryptFormat;
};

const encryptWithSymmetricKey = (symmetricKey, data) => {
  let encryptFormat = AES.encrypt(data, symmetricKey).toString();

  return encryptFormat;
  // const encrypted = CryptoJS.AES.encrypt(data, symmetricKey.toString(CryptoJS.enc.Hex), { mode: CryptoJS.mode.CBC });
  // return encrypted.toString();
};

export const groupEncryption = async () => {
  // 1. Generate symmetric key for the group
  const groupSymmetricKey = generateSymmetricKey();
  const generateKeyPairs = async () => {
    let privateKey = getRandomInt(1, 10000);
    const publicKey = powMod(generator, privateKey, prime);

    return {publicKey, privateKey};
  };
  // 2. Generate asymmetric key pairs for each user
  const user1KeyPairs = await generateKeyPairs();
  const user2KeyPairs = await generateKeyPairs();

  // 3. Encrypt the group symmetric key with each user's public key
  const user1EncryptedKey = await encryptWithPublicKey(
    user1KeyPairs.publicKey,
    groupSymmetricKey.toString(),
  );
  const user2EncryptedKey = await encryptWithPublicKey(
    user2KeyPairs.publicKey,
    groupSymmetricKey.toString(),
  );

  // 4. User 1 sends an encrypted message to the group
  const messageToGroup = 'Hello, group!';
  const encryptedMessage = encryptWithSymmetricKey(
    groupSymmetricKey,
    messageToGroup,
  );

  // 5. Other users decrypt the group symmetric key with their private key
  // const user1DecryptedKey = await decryptWithPrivateKey(
  //   user1KeyPairs.privateKey,
  //   user1EncryptedKey,
  // );
  // const user2DecryptedKey = await decryptWithPrivateKey(
  //   user2KeyPairs.privateKey,
  //   user2EncryptedKey,
  // );

  // // 6. Other users decrypt the message with the decrypted group symmetric key
  // const decryptedMessageUser1 = decryptWithSymmetricKey(
  //   user1DecryptedKey,
  //   encryptedMessage,
  // );
  // const decryptedMessageUser2 = decryptWithSymmetricKey(
  //   user2DecryptedKey,
  //   encryptedMessage,
  // );
};
