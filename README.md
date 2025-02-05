# CipherShare

A secure, self-hosted solution for sharing sensitive passwords through short-lived URLs. Built with Next.js and designed to run without a database dependency.

## Features

- 🔐 End-to-end encrypted password sharing
- ⏱️ Configurable expiration times
- 🔢 Usage limit controls
- 🔑 Optional access passwords
- 📊 No database required
- 🌐 Easy self-hosting
- 🎨 Modern cyberpunk UI
- 🌓 Dark mode optimized

## How It Works

1. Enter the password you want to share
2. Set an expiration time (default 24 hours)
3. Optionally add usage limits and access passwords
4. Get a secure URL to share
5. Recipients can access the password only within the set parameters

## Self-Hosting

```bash
# Clone the repository
git clone https://github.com/serverbauer/CipherShare

# Install dependencies
cd ciphershare
npm install

# Generate a secure encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Create .env.local and add your encryption key
cp .env.example .env.local

# Environment Variables

# Required: Your encryption key (generate using the command above)
NEXT_PUBLIC_ENCRYPTION_KEY=your-generated-key

# Required: Your base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Build and start
npm run build
npm start

# Security
- Passwords are encrypted before storage
- No database means no persistent data
- URLs expire automatically
- Optional access password protection
- Usage limits prevent unlimited access
```

# Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT License - feel free to use this project commercially or privately.

## Support
⭐ If you find this project useful, please star it on GitHub!

For issues and feature requests, please use the GitHub issue tracker.
