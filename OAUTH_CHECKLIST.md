# ✅ OAuth Setup Checklist

## Quick Start

- [ ] Read [OAUTH_SETUP.md](./OAUTH_SETUP.md)

## Get Credentials

- [ ] Create Google OAuth app at https://console.cloud.google.com/
  - Copy: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
  
- [ ] Create Microsoft OAuth app at https://portal.azure.com/
  - Copy: `MICROSOFT_CLIENT_ID` and `MICROSOFT_CLIENT_SECRET`

## Configure

- [ ] Create `.env` file in project root:
```
GOOGLE_CLIENT_ID=your_id_here
GOOGLE_CLIENT_SECRET=your_secret_here
MICROSOFT_CLIENT_ID=your_id_here
MICROSOFT_CLIENT_SECRET=your_secret_here
```

- [ ] Add `.env` to `.gitignore`
- [ ] Install: `npm install dotenv`
- [ ] Add `require('dotenv').config()` at top of main.js

## Files to Review

- [ ] `auth/oauthConfig.js` - Configuration
- [ ] `auth/authService.js` - OAuth flow logic
- [ ] `renderer.js` - OAuth interception (search for "OAuth")
- [ ] `main.js` - IPC handlers (search for "start-oauth")

## Test

1. Start your Electron app
2. Go to ChatGPT, Claude, or other OAuth-enabled site
3. Click "Sign in with Google" or "Sign in with Microsoft"
4. **System browser should open** (not Electron window) ✅
5. Log in normally
6. After login, webview should auto-login ✅

## Troubleshooting

If system browser doesn't open:
- Check console for errors
- Verify `shell.openExternal()` is working
- Make sure OAuth URL is correct

If "unsupported browser" error still appears:
- OAuth interception might not be working
- Add `console.log('[OAuth] Intercepted login')` to verify
- Check that will-navigate event listener is attached

If tokens don't inject:
- Check browser DevTools console in Electron app
- Look for errors in `oauth-tokens-received` handler
- Verify localhost port is available

## Success Signs

✅ System browser opens when clicking login (not an Electron window)
✅ Can login normally in system browser
✅ Electron app receives tokens
✅ Webview logs in automatically after OAuth complete
✅ No "unsupported or insecure browser" errors

## How It Works (Simple)

```
User clicks "Sign in with Google"
         ⬇️
Electron intercepts navigation
         ⬇️
Opens SYSTEM BROWSER (this is the key!)
         ⬇️
User logs in normally
         ⬇️
System browser redirects to localhost
         ⬇️
Tokens get exchanged
         ⬇️
Injected into Electron webview
         ⬇️
Webview reloads and is now logged in ✅
```

The reason this works: OAuth providers see SYSTEM BROWSER, not Electron, so they allow login!
