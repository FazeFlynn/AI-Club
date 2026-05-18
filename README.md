# AI Club

A desktop application that allows you to browse two websites side-by-side with JavaScript injection capabilities. Built with Electron, this app can load ANY website including those that block iframes (like ChatGPT, Claude, Google, etc.).

[Download Ai Club](https://github.com/FazeFlynn/AI-Club/blob/master/build/AI%20Club.exe)

## Features

- **Split View**: Browse two websites simultaneously with adjustable split (10%-90%)
- **Full Browser Capabilities**: Load any website without iframe restrictions
- **JavaScript Injection**: Inject custom HTML into elements with id="toInjectJS"
- **Navigation Controls**: Back, forward, reload buttons for each webview
- **DevTools**: Built-in developer tools for each webview
- **Session Persistence**: Maintains login sessions separately for each side
- **Keyboard Shortcuts**: Quick navigation with keyboard commands

## Installation

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Recommended: LTS version

2. **Navigate to the project directory**
   ```bash
   cd electron-split-browser
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Usage

### Starting the Application

```bash
npm start
```

Or for development with logging:
```bash
npm run dev
```

### Using the Browser

1. **Load Websites**:
   - Enter URLs in the input fields
   - Press "Load Left" or "Load Right" buttons
   - Or press Enter after typing a URL

2. **Navigate**:
   - Use ◄ ► buttons to go back/forward
   - Use ⟳ button to reload
   - Click links normally within the webviews

3. **Resize Views**:
   - Click and drag the middle divider
   - Adjust split from 10% to 90%

4. **Inject JavaScript**:
   - Type HTML code in the textarea
   - Click "Inject to Left", "Inject to Right", or "Inject to Both"
   - The code will be inserted into any element with id="toInjectJS"

5. **Developer Tools**:
   - Click "DevTools Left" or "DevTools Right"
   - Inspect and debug the loaded websites

### Keyboard Shortcuts

- `Ctrl/Cmd + R` - Reload left webview
- `Ctrl/Cmd + Shift + R` - Reload right webview
- `Ctrl/Cmd + ←` - Go back on left webview
- `Ctrl/Cmd + →` - Go forward on left webview

## JavaScript Injection

To inject custom HTML into a website:

1. The target website must have an element with `id="toInjectJS"`
2. Enter your HTML in the injection textarea
3. Click the appropriate inject button

Example target element in your website:
```html
<div id="toInjectJS">
    <!-- Your injected content will appear here -->
</div>
```

Example injection:
```html
<p style='color: red; font-weight: bold;'>Hello from Electron!</p>
```

## Security Notes

- Each webview has its own session partition (persist:left and persist:right)
- Cookies and local storage are isolated between the two webviews
- JavaScript injection only works on pages where you have the target element
- The app uses Chrome's security features for safe browsing

## Why This Works Where Iframes Don't

Websites like ChatGPT, Claude, Google, etc. block iframes using:
- `X-Frame-Options` headers
- `Content-Security-Policy` headers

Electron's webview is NOT an iframe - it's a full Chromium browser instance running in a separate process. This means:
- No iframe restrictions apply
- Full JavaScript execution
- Complete DOM access
- Separate security context

## Troubleshooting

### "Electron not found" error
```bash
npm install
```

### Websites not loading
- Check your internet connection
- Some sites may require login
- Try opening DevTools to see console errors

### Injection not working
- Verify the target element exists: `<div id="toInjectJS"></div>`
- Check DevTools console for errors
- Some websites may have Content Security Policies that block injection

## Building for Distribution

To package the app for distribution:

```bash
npm install electron-builder --save-dev
```

Add to package.json:
```json
"scripts": {
    "build": "electron-builder"
}
```

Then run:
```bash
npm run build
```

## Technical Details

- **Framework**: Electron 28.x
- **Renderer**: Chromium-based webview
- **Node Integration**: Enabled for main renderer
- **Context Isolation**: Disabled for webview access
- **Session Partitions**: Separate for each webview

## License

MIT

## Support

For issues or questions, please check:
- Electron documentation: https://www.electronjs.org/docs
- Webview API: https://www.electronjs.org/docs/latest/api/webview-tag

