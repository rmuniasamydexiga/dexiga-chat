import {forEach} from 'lodash';
import CryptoJS from 'react-native-crypto-js';
import crypto, {AES} from 'react-native-crypto-js';

const encryptionKey = 'mysecretkey';

const prime = 15485863; // Replace with a large prime number
const generator = 5; // Replace with a primitive root modulo prime

function powMod(base: number, exponent: number, modulus: number) {
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

function diffieHellman(
  prime: number,
  generator: number,
  privateKeyA: number,
  privateKeyB: number,
) {
  const publicKeyA = powMod(generator, privateKeyA, prime);
  const publicKeyB = powMod(generator, privateKeyB, prime);
  return {
    publicKeyA: encrypt(publicKeyA.toString(), encryptionKey),
    publicKeyB: encrypt(publicKeyB.toString(), encryptionKey),
  };
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const sharedKeyAlgorthim = (publicKey: string, privateKey: any) => {
  let publicKeys = decrypt(publicKey, encryptionKey);
  let privateKeys = decrypt(privateKey, encryptionKey);
  let sharedSecret = powMod(Number(publicKeys), Number(privateKeys), prime);

  return sharedSecret;
};
export const diffieHellManAlgorthim = () => {
  const privateKeyA = getRandomInt(1, 10000); // Adjust the range as needed
  const privateKeyB = getRandomInt(1, 10000);

  let result = diffieHellman(prime, generator, privateKeyA, privateKeyB);

  return {
    ...result,
    privateKeyA: encrypt(privateKeyA.toString(), encryptionKey),
    privateKeyB: encrypt(privateKeyB.toString(), encryptionKey),
  };
};

// export const encrypt=(text: string,encryptionKey:string)=> {
//     const cipher = CryptoJS.AES.encrypt(text, encryptionKey).toString();;
//     return cipher;
// }
export const encrypt = (data: string, key: string) => {
  // let encryptFormat = AES.encrypt(data, key).toString();
  // return encryptFormat;
  return key
};

export const decrypt = (cipherText: string, encryptionKey: string) => {
  // let decryptFormat = AES.decrypt(cipherText, encryptionKey).toString(
  //   crypto.enc.Utf8,
  // );
  // return decryptFormat;
  return cipherText;
};
// Decrypt function returning a Buffer

export const generateKeyPair = () => {
  const privateKey = getRandomInt(1, 10000);
  let result = diffieHellmanWithSingleUser(prime, generator, privateKey);
  return {
    ...result,
    privateKey: encrypt(privateKey.toString(), encryptionKey),
  };
};
function diffieHellmanWithSingleUser(
  prime: number,
  generator: number,
  privateKey: number,
) {
  const publicKey = powMod(generator, privateKey, prime);
  return {
    publicKey: encrypt(publicKey.toString(), encryptionKey),
  };
}

function generateSymmetricKey() {
  let randomString = '';
  for (let i = 0; i < 12; i++) {
    const randomByte = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
    randomString += randomByte;
  }
  return randomString;
}

export const groupChatSimulation = () => {
  // const groupMembers = Array.from({ length: 10 }, () => generateKeyPair());
  const groupMembers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(() =>
    generateKeyPair(),
  );

  const groupKey = generateSymmetricKey();
  const originalMessage = 'Hello, this is a secret message!';
  const groupKeys = groupMembers.map((member, index) => {
    const otherMembers = groupMembers.filter((_, i) => i !== index);
    const symmetricGroupKey = otherMembers.reduce((key, otherMember) => {
      return sharedKeyAlgorthim(member.publicKey, member.privateKey);
    }, '');

    return symmetricGroupKey;
  });
  groupKeys.forEach(ele => {
    let grouPKeyEncrypted = encrypt(ele.toString(), groupKey);

    const encryptedMessage = encrypt(originalMessage, grouPKeyEncrypted);

    const deCryptedMessage = decrypt(encryptedMessage, grouPKeyEncrypted);
  });
};
