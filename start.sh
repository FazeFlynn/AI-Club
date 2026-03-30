#!/bin/bash

# Split Browser - Quick Start Script

echo "=================================="
echo "Split Browser - Electron App Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "=================================="
echo "Starting Split Browser..."
echo "=================================="
echo ""
echo "Features:"
echo "  • Browse two sites side-by-side"
echo "  • Drag the center divider to resize"
echo "  • Inject JavaScript into pages with #toInjectJS"
echo "  • Works with ANY website (including ChatGPT!)"
echo ""
echo "Keyboard Shortcuts:"
echo "  • Alt + F12: Open DevTools for Left view"
echo "  • Ctrl + Shift + F12: Open DevTools for Right view"
echo ""
echo "=================================="
echo ""

npm start
