// function generateChallenge(length = 32) {
//   return crypto.getRandomValues(new Uint8Array(length));
// }

// export function encryptData(data, publicKey) {
//   const encoder = new TextEncoder();
//   const dataBuffer = encoder.encode(data);

//   return window.crypto.subtle
//     .encrypt(
//       {
//         name: "RSA-OAEP",
//       },
//       publicKey,
//       dataBuffer
//     )
//     .then((encryptedBuffer) => {
//       return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
//     })
//     .catch((e) => {
//       alert("An error occurred while encrypting.");
//       console.error(e);
//     });
// }

// export function decryptData(encryptedData, privateKey) {
//   const encryptedBuffer = Uint8Array.from(atob(encryptedData), (c) =>
//     c.charCodeAt(0)
//   );

//   return window.crypto.subtle
//     .decrypt(
//       {
//         name: "RSA-OAEP",
//       },
//       privateKey,
//       encryptedBuffer
//     )
//     .then((decryptedBuffer) => {
//       const decoder = new TextDecoder();
//       return decoder.decode(decryptedBuffer);
//     })
//     .catch((e) => {
//       alert("An error occurred 2.");
//       console.error(e);
//     });
// }

// export async function getPublicKey() {
//   try {
//     console.log("1");
//     const publicKeyCredentialCreationOptions = {
//       publicKey: {
//         challenge: new Uint8Array(32),
//         rp: {
//           name: "Transient App",
//         },
//         user: {
//           id: new Uint8Array(16),
//           name: "name",
//           displayName: "Name",
//         },
//         pubKeyCredParams: [
//           { alg: -7, type: "public-key" }, // ES256
//           { alg: -257, type: "public-key" }, // RS256
//         ],
//         authenticatorSelection: {
//           authenticatorAttachment: "platform",
//           userVerification: "required",
//         },
//         attestation: "direct",
//       },
//     };

//     console.log("2");
//     const credential = await navigator.credentials.create(
//       publicKeyCredentialCreationOptions
//     );
//     const publicKey = credential.response.getPublicKey();
//     console.log("3");

//     const importedKey = await window.crypto.subtle.importKey(
//       "spki",
//       publicKey,
//       {
//         name: "RSA-OAEP",
//         hash: { name: "SHA-256" },
//       },
//       true,
//       ["encrypt"]
//     );
//     console.log("4");
//     return importedKey;
//   } catch (e) {
//     alert("An error occurred while trying to create and get the public key.");
//     console.error(e);
//   }
// }

// export async function getPrivateKey() {
//   try {
//     const publicKeyCredentialRequestOptions = {
//       publicKey: {
//         challenge: new Uint8Array(32),
//         rpId: "example.com",
//         userVerification: "required",
//       },
//     };

//     const assertion = await navigator.credentials.get(
//       publicKeyCredentialRequestOptions
//     );
//     const privateKey = assertion.response.getPrivateKey();

//     return window.crypto.subtle.importKey(
//       "pkcs8",
//       privateKey,
//       {
//         name: "RSA-OAEP",
//         hash: { name: "SHA-256" },
//       },
//       true,
//       ["decrypt"]
//     );
//   } catch (e) {
//     alert("An error occurred while getting your key.");
//     console.error(e);
//   }
// }

// async function registerWebAuthnCredential() {
//   const challenge = generateChallenge();

//   const publicKey = {
//       challenge,
//       rp: {
//           name: "Your Application Name"
//       },
//       user: {
//           id: new Uint8Array(16), // You should replace this with your user's unique ID
//           name: "user@example.com",
//           displayName: "User Name"
//       },
//       pubKeyCredParams: [{alg: -7, type: "public-key"}],
//       authenticatorSelection: {
//           authenticatorAttachment: "platform", // Use "cross-platform" for external authenticators
//           userVerification: "preferred"
//       },
//       timeout: 60000,
//       attestation: "direct",
//       extensions: {
//           prf: {enabled: true}
//       }
//   };

//   // Create the credential
//   const credential = await navigator.credentials.create({publicKey});

//   // Convert the ArrayBuffer to a Base64 string or other format suitable for storage
//   const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

//   return credentialId;
// }

// (async () => {
//   try {
//       const credentialId = await registerWebAuthnCredential();
//       alert(credentialId)
//       console.log("Credential ID:", credentialId);
//       // Store this credential ID securely for later use
//   } catch (error) {
//       console.error("Error during WebAuthn registration:", error);
//   }
// })();

function WebAuthnManager(config) {
  const { appName, userInfo } = config;

  // Function to generate a secure random challenge
  function generateChallenge(length = 32) {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  // Function to register a new WebAuthn credential
  async function registerCredential() {
    const challenge = generateChallenge();

    // const publicKey = {
    //   challenge: challenge,
    //   rp: {
    //     name: appName,
    //   },
    //   user: {
    //     id: new Uint8Array(userInfo.id),
    //     name: userInfo.email,
    //     displayName: userInfo.displayName,
    //   },
    //   pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    //   authenticatorSelection: {
    //     authenticatorAttachment: "platform", // Use "cross-platform" for external authenticators
    //     userVerification: "preferred",
    //   },
    //   timeout: 60000,
    //   attestation: "direct",
    //   extensions: {
    //     prf: { enabled: true },
    //   },
    // };

    const publicKey = {
      pubKeyCredParams: [{type: "public-key", alg: -7}],
      timeout: 60000,
      authenticatorSelection: {
          authenticatorAttachment: "platform",
          residentKey: "required",
      },
      extensions: {prf: {}},

      // unused without attestation so a dummy value is fine.
      challenge: new Uint8Array([0]).buffer,
    }

    const credential = await navigator.credentials.create({ publicKey });

    const credentialId = btoa(
      String.fromCharCode(...new Uint8Array(credential.rawId))
    );

    return credentialId;
  }

  // Function to derive a key using PRF
  async function deriveKeyWithPRF(credentialId, prfInput) {
    const options = {
      challenge: generateChallenge(),
      allowCredentials: [
        {
          type: "public-key",
          id: Uint8Array.from(atob(credentialId), (c) => c.charCodeAt(0)),
        },
      ],
      extensions: {
        prf: {
          inputs: [
            {
              id: Uint8Array.from(atob(credentialId), (c) => c.charCodeAt(0)),
              first: new Uint8Array(prfInput),
            },
          ],
        },
      },
    };

    console.log("Requesting assertion with options:", options);

    const assertion = await navigator.credentials.get({ publicKey: options });
    const clientExtensionResults = assertion.getClientExtensionResults();

    console.log("Client extension results:", clientExtensionResults);

    if (!clientExtensionResults.prf || !clientExtensionResults.prf.results.length) {
        throw new Error("PRF extension result is empty or missing");
    }

    console.log(clientExtensionResults);
    const prfResult = clientExtensionResults.prf.results[0];

    return await crypto.subtle.importKey(
      "raw",
      prfResult.output,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  }

  // Function to encrypt a string
  async function encryptString(key, plainText) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedText = new TextEncoder().encode(plainText);

    const ciphertext = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encodedText
    );

    return {
      iv: iv,
      ciphertext: new Uint8Array(ciphertext),
    };
  }

  // Function to decrypt a string
  async function decryptString(key, iv, ciphertext) {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  }

  return {
    registerCredential,
    deriveKeyWithPRF,
    encryptString,
    decryptString,
  };
}

const config = {
  appName: "Your Application Name",
  userInfo: {
    id: new Uint8Array(16),
    email: "user@example.com",
    displayName: "User Name",
  },
};

// const webAuthn = WebAuthnManager(config);

// (async () => {
//   try {
//     // Register a new credential
//     const credentialId = await webAuthn.registerCredential();
//     console.log("Credential ID:", credentialId);

//     // Derive a key using PRF
//     const key = await webAuthn.deriveKeyWithPRF(credentialId, "prf-input");

//     // Encrypt a string
//     const plainText = "Hello, WebAuthn with PRF!";
//     const { iv, ciphertext } = await webAuthn.encryptString(key, plainText);
//     console.log("Encrypted:", ciphertext);

//     // Decrypt the string
//     const decryptedText = await webAuthn.decryptString(key, iv, ciphertext);
//     console.log("Decrypted:", decryptedText);
//   } catch (error) {
//     console.error(new Error(error));
//   }
// })();

// navigator.credentials.create({
//   publicKey: {
//       rp: {name: "Acme"},
//       user: {
//           id: new Uint8Array(16),
//           name: "john.p.smith@example.com",
//           displayName: "John P. Smith"
//       },
//       pubKeyCredParams: [{type: "public-key", alg: -7}],
//       timeout: 60000,
//       authenticatorSelection: {
//           authenticatorAttachment: "platform",
//           residentKey: "required",
//       },
//       extensions: {prf: {}},

//       // unused without attestation so a dummy value is fine.
//       challenge: new Uint8Array([0]).buffer,
//   }
// }).then((c) => {console.log(c.getClientExtensionResults());});

// navigator.credentials.get({
//   publicKey: {
//       timeout: 60000,
//       challenge: new Uint8Array([ 
//           // must be a cryptographically random number sent from a server. Don't use dummy
//           // values in real authentication situations.
//           1,2,3,4,
//       ]).buffer,
//       extensions: {prf: {eval: {first: new TextEncoder().encode("Foo encryption key")}}},
//   },
// }).then((c) => {
//   console.log("ENCRYPTED")
//   console.log(btoa(String.fromCharCode.apply(null, new Uint8Array(c.getClientExtensionResults().prf.results.first))));
// }); 