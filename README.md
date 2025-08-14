## Setup Instructions:

1. **Initialize the project:**
   ```bash
   npm install
   ```

2. **Development with watch mode:**
   ```bash
   npm run dev
   ```
   This will start `tsx` in watch mode - it automatically recompiles and reruns when you change any `.ts` files.

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Run built code:**
   ```bash
   npm start
   ```

## Key Features:

- **tsx**: Fast TypeScript execution with watch mode
- **Auto-reload**: Changes to `.ts` files trigger immediate recompilation and restart
- **Modern TypeScript**: ES2020 target with strict type checking
- **Source maps**: For better debugging
- **Clean structure**: `src/` for source, `dist/` for compiled output

---

`tsconfig.json`, it's set to:

```json
"module": "commonjs"
```

This means your TypeScript code compiles to CommonJS modules (using `require()` and `module.exports`).

However, there's an important distinction in this setup:

1. **Development (`npm run dev`)**: `tsx` runs TypeScript directly without explicitly compiling to CommonJS first - it handles the transformation in memory
2. **Production build (`npm run build`)**: TypeScript compiler outputs actual CommonJS `.js` files to the `dist/` folder

If **ES modules** is preferred instead, switch by updating the tsconfig:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2022",  // or "ESNext"
    // ... rest stays the same
  }
}
```

And add to `package.json`:
```json
{
  "type": "module",
  // ... rest of package.json
}
```
