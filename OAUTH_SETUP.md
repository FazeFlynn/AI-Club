# OAuth Login Setup Guide for Electron AI Duel

## Overview
This guide explains how to set up OAuth login (Google, Microsoft) in your Electron app so that you can use supported OAuth providers without the "use a supported and secured browser" error.

## How It Works

1. **User clicks login** on a website (ChatGPT, Claude, etc.)
2. **Electron intercepts** the redirect to Google/Microsoft login
3. **System browser opens** the OAuth login (not Electron) - this makes OAuth providers think it's a real browser
4. **User logs in** in the system browser
5. **Callback server** (running on localhost) receives the auth code
6. **Tokens are exchanged** for the auth code
7. **Tokens are injected** into the webview
8. **Webview reloads** and uses the tokens to autologin

## Setup Steps

### 1. Get OAuth Credentials

**For Google:**
- Go to https://console.cloud.google.com/
- Create a new project
- Enable "Google+ API"
- Create OAuth 2.0 credentials (Web application)
- Add to Authorized redirect URIs: `http://127.0.0.1:*` (all ports)
- Copy Client ID and Client Secret

**For Microsoft:**
- Go to https://portal.azure.com/
- Create a new App Registration
- Add redirect URI: `http://127.0.0.1:*/callback` (wildcard port)
- Create a Client Secret
- Copy Application (client) ID and Secret

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here
```

Then load these in `main.js` at the top:

```javascript
require('dotenv').config();
```

Install dotenv: `npm install dotenv`

### 3. Files Modified/Created

✅ **auth/oauthConfig.js** - OAuth provider configuration
✅ **auth/authService.js** - Enhanced OAuth flow with token exchange (UPDATED)  
✅ **renderer.js** - OAuth interception and token injection (UPDATED)
✅ **main.js** - IPC handlers for OAuth (UPDATED)

### 4. How the Flow Works

**In renderer.js:**
- When user tries to login via Google/Microsoft, it's intercepted
- Instead of opening in the webview, it triggers OAuth flow
- Tokens are stored in webview's localStorage
- Webview reloads with tokens ready for authentication

**In main.js:**
- OAuth flow opens in system browser
- Local server listens for callback on random port
- Tokens are exchanged and sent back to renderer

### 5. Test It

1. Run your Electron app
2. Navigate to ChatGPT, Claude, or other OAuth-enabled site
3. Click "Sign in with Google" or "Sign in with Microsoft"
4. System browser should open (not Electron window)
5. After logging in, tokens should be injected
6. Webview should auto-login

## Troubleshooting

### "Only trusted clients are allowed to access this API"
- Make sure correct Client ID/Secret are in env variables
- Check that redirect URI matches exactly: `http://127.0.0.1:PORT/callback`

### Browser doesn't open
- Check that shell.openExternal() is working
- Try opening a URL manually: `shell.openExternal('https://google.com')`

### "Unsupported browser" error still shows
- The webview is still trying to auth inside Electron
- Check that will-navigate and new-window listeners are attached
- Add logging to see if interception is working

### Tokens not injecting
- Check browser console for errors in oauth-tokens-received listener
- Verify that localStorage is working in the webview

### Port conflicts
- The auth server uses a random available port, so port conflicts shouldn't happen
- But if it does, check that localhost:3000-9999 is available

## Security Notes

⚠️ **Never commit your .env file!**
- Add `.env` to `.gitignore`
- Client Secret should never be committed

✅ **This approach is secure because:**
- User logs in on system browser (not Electron)
- OAuth providers can verify it's a real browser
- Tokens are transmitted over HTTPS
- Callback uses localhost, not accessible externally

## Testing with Different Providers

- **ChatGPT:** Uses Google OAuth
- **Claude:** Uses Google or standard email
- **Gemini:** Uses Google OAuth  
- **Copilot:** Uses Microsoft OAuth
- **Perplexity:** Uses Google or email

Each site will have its own login flow. The interception works for all OAuth-based logins.

## Advanced: Storing Tokens

After tokens are injected into localStorage, you can:

1. **Auto-refresh tokens** when they expire
2. **Store tokens** persistently in the partition
3. **Reuse tokens** across app restarts

Example:
```javascript
const tokens = JSON.parse(localStorage.getItem('oauth_tokens'));
if (tokens && tokens.access_token) {
  // Use tokens to make authenticated requests
}
```

## Supported Providers

✅ **Working:**
- Google OAuth (Gmail, Google Workspace)
- Microsoft OAuth (Office 365, Azure)
- Any OAuth 2.0 + PKCE provider

❌ **Not easily supported:**
- Custom enterprise SSO (requires Kerberos/NTLM)
- Passwordless WebAuthn (Electron limitations)
