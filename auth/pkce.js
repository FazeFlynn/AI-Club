const crypto = require("crypto");

function base64URLEncode(buffer) {
  return buffer.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

function generatePKCE() {
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(codeVerifier));

  return { codeVerifier, codeChallenge };
}

module.exports = { generatePKCE };
