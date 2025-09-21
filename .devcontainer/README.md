# Medogram Modern - GitHub Codespaces

This repository is configured to work seamlessly with GitHub Codespaces for development.

## Quick Start

1. Click the "Code" button on the repository page
2. Select "Codespaces" tab
3. Click "Create codespace on main" or "Create codespace on [branch]"
4. Wait for the container to build and start
5. The development server will automatically start on port 5173

## What's Included

### Development Environment
- **Node.js 20** - Latest LTS version
- **npm** - Package manager
- **Git** - Version control
- **GitHub CLI** - For repository management

### VS Code Extensions
- **Tailwind CSS IntelliSense** - For Tailwind CSS support
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **TypeScript** - TypeScript support
- **Auto Rename Tag** - HTML tag management
- **Path IntelliSense** - File path autocomplete
- **GitHub Actions** - Workflow management

### Ports
- **5173** - Vite development server (primary)
- **5174** - Vite development server (alternative if 5173 is busy)
- **3000** - Alternative application port

### Environment Variables
- `NODE_ENV=development`
- `VITE_API_BASE_URL=https://api.medogram.ir`
- `VITE_LOCAL_API_URL=https://api.medogram.ir`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Development Workflow

1. The container automatically installs dependencies on creation
2. The development server starts automatically
3. Changes are hot-reloaded
4. Use the integrated terminal for additional commands

## Troubleshooting

### Port Issues
If ports aren't forwarding automatically:
1. Go to "Ports" tab in VS Code
2. Click "Forward a Port"
3. Enter `5173` for the dev server

### Dependency Issues
If you encounter dependency problems:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Container Issues
If the container fails to start:
1. Check the "Codespaces" tab in GitHub
2. Try recreating the codespace
3. Check the logs for specific error messages

## Customization

You can customize the development environment by modifying:
- `.devcontainer/devcontainer.json` - Container configuration
- `.devcontainer/Dockerfile` - Custom Docker image
- `.vscode/settings.json` - VS Code settings

## Support

For issues related to:
- **Codespaces**: Check GitHub's documentation
- **Development**: Create an issue in this repository
- **Application**: Contact the Medogram team