const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const http = require('http');

const isDev = process.argv.includes('--dev');

// Simple file watcher
function watchFiles(callback) {
  const srcDir = path.join(__dirname, 'src');
  
  function watch(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
      const fullPath = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        watch(fullPath);
      } else if (dirent.isFile() && /\.(ts|tsx|js|jsx)$/.test(dirent.name)) {
        fs.watchFile(fullPath, { interval: 100 }, callback);
      }
    });
  }
  
  watch(srcDir);
}

// Simple HTTP server with live reload
function createDevServer() {
  const clients = new Set();
  
  const server = http.createServer((req, res) => {
    // Handle Server-Sent Events for live reload
    if (req.url === '/hmr') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });
      
      clients.add(res);
      
      // Send initial connection
      res.write('data: connected\n\n');
      
      req.on('close', () => {
        clients.delete(res);
      });
      
      return;
    }
    
    // Serve files
    let filePath = req.url === '/' ? '/index.html' : req.url;
    const fullPath = path.join(__dirname, 'dist', filePath);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath);
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
      };
      
      res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
      fs.createReadStream(fullPath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  
  // Broadcast reload to all clients
  function broadcast(message) {
    clients.forEach(client => {
      try {
        client.write(`data: ${message}\n\n`);
      } catch (e) {
        clients.delete(client);
      }
    });
  }
  
  return { server, broadcast };
}

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
    banner: isDev ? {
      js: `
(() => {
  if (typeof window !== 'undefined') {
    const eventSource = new EventSource('/hmr');
    eventSource.onmessage = function(event) {
      if (event.data === 'reload') {
        console.log('🔄 Hot reloading...');
        window.location.reload();
      }
    };
    eventSource.onerror = function() {
      console.log('HMR connection lost. Retrying...');
      setTimeout(() => window.location.reload(), 1000);
    };
  }
})();
      `
    } : {},
  };

  if (isDev) {
    // Create development server
    const { server, broadcast } = createDevServer();
    server.listen(3000, 'localhost', () => {
      console.log('🚀 Server running at http://localhost:3000');
      console.log('🔥 Hot Module Replacement enabled');
    });
    
    // Initial build
    try {
      await esbuild.build(buildOptions);
      console.log('✅ Initial build complete');
    } catch (error) {
      console.error('❌ Build error:', error);
    }
    
    // Watch for changes
    console.log('👀 Watching for changes...');
    let isBuilding = false;
    
    watchFiles(async () => {
      if (isBuilding) return;
      isBuilding = true;
      
      try {
        console.log('📝 File changed, rebuilding...');
        await esbuild.build(buildOptions);
        console.log('✅ Rebuild complete');
        broadcast('reload');
      } catch (error) {
        console.error('❌ Build error:', error);
      } finally {
        isBuilding = false;
      }
    });

  } else {
    // Production build
    try {
      await esbuild.build(buildOptions);
      console.log('✅ Production build complete!');
    } catch (error) {
      console.error('❌ Build error:', error);
      process.exit(1);
    }
  }
}

build().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});