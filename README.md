# React Esbuild TypeScript Starter

A minimal React starter project with TypeScript, esbuild and Hot Module Replacement (HMR).

## Features

- ⚡ Lightning fast builds with esbuild
- 🔥 Hot Module Replacement (HMR) for instant development feedback
- 📦 Minimal setup with no complex configuration
- 🚀 Production-ready builds
- 💪 Full TypeScript support with strict type checking
- 🎯 Modern React 18 with automatic JSX transform

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   This will start the development server at `http://localhost:3000` with HMR enabled.

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
react-esbuild-starter/
├── src/
│   ├── index.tsx         # Entry point
│   └── App.tsx           # Main App component
├── dist/
│   └── index.html        # HTML template
├── build.js              # Esbuild configuration
├── tsconfig.json         # TypeScript configuration
├── package.json
└── README.md
```

## Development

- Edit files in the `src/` directory
- Changes are automatically reflected in the browser thanks to HMR
- TypeScript provides full intellisense and compile-time error checking
- The development server provides sourcemaps for easier debugging

## TypeScript Configuration

The project uses a strict TypeScript configuration with:
- Strict type checking enabled
- Modern ES2020 target
- React 18 JSX transform (no need to import React)
- Full DOM and ES6 lib support

## Customization

The build configuration is in `build.js`. Key features:
- Automatic TypeScript compilation
- JSX automatic transform (React 17+)
- Development vs production optimizations
- Hot module replacement in development

You can modify:
- Entry points
- Output directory
- Build targets
- TypeScript compiler options in `tsconfig.json`
- Additional esbuild options