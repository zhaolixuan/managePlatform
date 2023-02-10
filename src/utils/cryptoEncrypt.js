import CryptJS from 'crypto-js';

function encrypt(_content, _key, _iv) {
  const content = CryptJS.enc.Utf8.parse(_content);
  const key = CryptJS.enc.Utf8.parse(_key);
  const iv = CryptJS.enc.Utf8.parse(_iv);

  const encrypted = CryptJS.AES.encrypt(content, key, {
    iv,
    mode: CryptJS.mode.CBC,
    padding: CryptJS.pad.Pkcs7,
  });
  return CryptJS.enc.Base64.stringify(encrypted.ciphertext);
}

export default encrypt;
