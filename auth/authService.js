const crypto = require("crypto");
const { shell } = require("electron");
const https = require("https");
const querystring = require("querystring");
const { generatePKCE } = require("./pkce");
const { startAuthServer } = require("./authServer");
const { OAUTH_CONFIG } = require("./oauthConfig");
const {
  saveContext,
  getContext,
  removeContext
} = require("./authContextStore");

function randomString() {
  return crypto.randomBytes(16).toString("hex");
}

// Enhanced auth flow - opens in system browser, handles token exchange
async function login(siteName, provider, mainWindow) {
  try {
    const { codeVerifier, codeChallenge } = generatePKCE();
    const state = siteName + "_" + randomString();

    saveContext(state, {
      siteName,
      provider,
      codeVerifier,
      mainWindow
    });

    const port = await startAuthServer(async (code, returnedState) => {
      try {
        const context = getContext(returnedState);
        if (!context) {
          console.error('No context found for state:', returnedState);
          return;
        }

        console.log(`[OAuth] Exchanging code for ${context.provider} on ${context.siteName}`);

        const tokens = await exchangeCode(
          code,
          context.codeVerifier,
          context.provider,
          port
        );

        console.log(`[OAuth] Got tokens for ${context.siteName}`);

        // Send tokens to renderer to inject into webview
        mainWindow.webContents.send('oauth-tokens-received', {
          siteName: context.siteName,
          provider: context.provider,
          tokens,
          code
        });

        // Tell renderer to reload the webview 
        mainWindow.webContents.send('oauth-complete', context.siteName);

        removeContext(returnedState);
      } catch (error) {
        console.error('[OAuth] Error in callback:', error);
        mainWindow.webContents.send('oauth-error', {
          error: error.message
        });
      }
    });

    const authUrl = buildProviderUrl(provider, port, codeChallenge, state);

    console.log(`[OAuth] Opening auth URL in system browser on port ${port}`);
    console.log(`[OAuth] Auth URL: ${authUrl}`);

    // ✅ CRITICAL: Actually open the browser!
    await shell.openExternal(authUrl);

  } catch (error) {
    console.error('[OAuth] Login error:', error);
    mainWindow.webContents.send('oauth-error', {
      error: error.message
    });
  }
}

function buildProviderUrl(provider, port, challenge, state) {
  const config = OAUTH_CONFIG[provider];
  const redirectUri = `http://127.0.0.1:${port}/callback`;

  if (provider === "google") {
    return "https://accounts.google.com/o/oauth2/v2/auth?" +
      `response_type=code` +
      `&client_id=${config.clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(config.scopes)}` +
      `&code_challenge=${challenge}` +
      `&code_challenge_method=S256` +
      `&state=${state}` +
      `&access_type=offline`;
  }

  if (provider === "microsoft") {
    return "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" +
      `response_type=code` +
      `&client_id=${config.clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(config.scopes + ' offline_access')}` +
      `&code_challenge=${challenge}` +
      `&code_challenge_method=S256` +
      `&state=${state}`;
  }
}

async function exchangeCode(code, verifier, provider, port) {
  const config = OAUTH_CONFIG[provider];
  const redirectUri = `http://127.0.0.1:${port}/callback`;

  const payload = querystring.stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code_verifier: verifier
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: new URL(config.tokenEndpoint).hostname,
      path: new URL(config.tokenEndpoint).pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const tokens = JSON.parse(data);
          if (tokens.error) {
            throw new Error(`OAuth error: ${tokens.error_description || tokens.error}`);
          }
          console.log(`[OAuth] Token exchange successful for ${provider}`);
          resolve(tokens);
        } catch (error) {
          reject(new Error(`Failed to parse token response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`[OAuth] Request error for ${provider}:`, error);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

module.exports = { login };
