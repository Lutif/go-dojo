# App Icons

Place your app icons here for electron-builder:

| File | Size | Platform |
|------|------|----------|
| `icon.icns` | 512x512 | macOS |
| `icon.ico` | 256x256 | Windows |
| `icon.png` | 512x512 | Linux |

You can generate all formats from a single 1024x1024 PNG using:

```bash
# Install electron-icon-builder
npm install -g electron-icon-builder

# Generate all icons from a source PNG
electron-icon-builder --input=./icon-source.png --output=./resources
```

Or use an online converter like https://www.icoconverter.com/
