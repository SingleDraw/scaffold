const esbuild = require('esbuild');
const path = require('path');

const isDev = process.argv.includes('--dev');

async function build() {
  const buildOptions = {
    entryPoints: ['src/index.tsx'],
    bundle: true,
    outdir: 'dist',
    format: 'esm',
    target: 'es2020',
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx',
      '.ts': 'ts',
      '.tsx': 'tsx',
    },
    jsx: 'automatic',
    define: {
      'process.env.NODE_ENV': isDev ? '"development"' : '"production"',
    },
    sourcemap: isDev,
    minify: !isDev,
  };

  if (isDev) {
    // Development with HMR
    const ctx = await esbuild.context(buildOptions);
    
    await ctx.watch();
    console.log('👀 Watching for changes...');

    const { host, port } = await ctx.serve({
      servedir: 'dist',
      host: 'localhost',
      port: 3000,
    });

    console.log(`🚀 Server running at http://${host}:${port}`);
  } else {
    // Production build
    await esbuild.build(buildOptions);
    console.log('✅ Build complete!');
  }
}

build().catch(() => process.exit(1));