const crypto = require("crypto");
const { shell } = require("electron");
const { generatePKCE } = require("./pkce");
const { startAuthServer } = require("./authServer");
const {
  saveContext,
  getContext,
  removeContext
} = require("./authContextStore");

function randomString() {
  return crypto.randomBytes(16).toString("hex");
}

async function login(siteName, provider, mainWindow) {
  const { codeVerifier, codeChallenge } = generatePKCE();

  const state = siteName + "_" + randomString();

  saveContext(state, {
    siteName,
    provider,
    codeVerifier
  });

  const port = await startAuthServer(async (code, returnedState) => {
    const context = getContext(returnedState);
    if (!context) return;

    await exchangeCode(
      code,
      context.codeVerifier,
      port
    );

    // Tell renderer to refresh correct webview
    mainWindow.webContents.send(
      "oauth-complete",
      context.siteName
    );

    removeContext(returnedState);
  });

  const authUrl =
    buildProviderUrl(provider, port, codeChallenge, state);

  shell.openExternal(authUrl);
}

function buildProviderUrl(provider, port, challenge, state) {

  if (provider === "google") {
    return "https://accounts.google.com/o/oauth2/v2/auth?" +
      "response_type=code" +
      "&client_id=YOUR_GOOGLE_CLIENT_ID" +
      "&redirect_uri=http://127.0.0.1:" + port + "/callback" +
      "&scope=openid email profile" +
      "&code_challenge=" + challenge +
      "&code_challenge_method=S256" +
      "&state=" + state;
  }

  if (provider === "microsoft") {
    return "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" +
      "response_type=code" +
      "&client_id=YOUR_MICROSOFT_CLIENT_ID" +
      "&redirect_uri=http://127.0.0.1:" + port + "/callback" +
      "&scope=openid profile email" +
      "&code_challenge=" + challenge +
      "&code_challenge_method=S256" +
      "&state=" + state;
  }
}

async function exchangeCode(code, verifier, port) {
  console.log("Received auth code:", code);
  // Exchange with provider token endpoint
}
