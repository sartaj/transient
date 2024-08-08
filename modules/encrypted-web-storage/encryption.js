export function encryptData(data, publicKey) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  return window.crypto.subtle
    .encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      dataBuffer
    )
    .then((encryptedBuffer) => {
      return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
    })
    .catch((e) => {
      alert("An error occurred while encrypting.");
      console.error(e);
    });
}

export function decryptData(encryptedData, privateKey) {
  const encryptedBuffer = Uint8Array.from(atob(encryptedData), (c) =>
    c.charCodeAt(0)
  );

  return window.crypto.subtle
    .decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      encryptedBuffer
    )
    .then((decryptedBuffer) => {
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    })
    .catch((e) => {
      alert("An error occurred 2.");
      console.error(e);
    });
}

export async function getPublicKey() {
  try {
    const publicKeyCredentialCreationOptions = {
      publicKey: {
        challenge: new Uint8Array(32),
        rp: {
          name: "Test Note Taking App",
        },
        user: {
          id: new Uint8Array(16),
          name: "sartaj",
          displayName: "Sartaj",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        attestation: "direct",
      },
    };

    const credential = await navigator.credentials.create(
      publicKeyCredentialCreationOptions
    );
    const publicKey = credential.response.getPublicKey();

    return window.crypto.subtle.importKey(
      "spki",
      publicKey,
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      true,
      ["encrypt"]
    );
  } catch (e) {
    alert("An error occurred 3.");
    console.error(e);
  }
}

export async function getPrivateKey() {
  try {
    const publicKeyCredentialRequestOptions = {
      publicKey: {
        challenge: new Uint8Array(32),
        rpId: "example.com",
        userVerification: "required",
      },
    };

    const assertion = await navigator.credentials.get(
      publicKeyCredentialRequestOptions
    );
    const privateKey = assertion.response.getPrivateKey();

    return window.crypto.subtle.importKey(
      "pkcs8",
      privateKey,
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      true,
      ["decrypt"]
    );
  } catch (e) {
    alert("An error occurred while getting your key.");
    console.error(e);
  }
}
