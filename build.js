const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const http = require('http');

const isDev = process.argv.includes('--dev');

// Manual CSS modules plugin that definitely works
const cssModulesPlugin = {
  name: 'css-modules-manual',
  setup(build) {
    const cssChunks = [];
    
    build.onLoad({ filter: /\.module\.scss$/ }, async (args) => {
      console.log(' Loading CSS module:', args.path);
      
      let css = await fs.promises.readFile(args.path, 'utf8');
      console.log(' Original SCSS:', css);
      
      // Compile SCSS to CSS
      const sass = require('sass');
      const compiled = sass.compileString(css, {
        loadPaths: [path.dirname(args.path)]
      });
      css = compiled.css;
      console.log(' Compiled CSS:', css);
      
      // Generate class mappings
      const classMap = {};
      const basename = path.basename(args.path, '.module.scss');
      
      const transformedCSS = css.replace(/\.([a-zA-Z][\w-]*)/g, (match, className) => {
        const scopedName = `${basename}__${className}__${Math.random().toString(36).slice(2, 6)}`;
        classMap[className] = scopedName;
        console.log(` Scoped: .${className} -> .${scopedName}`);
        return `.${scopedName}`;
      });
      
      console.log('Final class mappings:', classMap);
      console.log('Transformed CSS:', transformedCSS);
      
      // Store for extraction
      cssChunks.push(transformedCSS);
      
      return {
        contents: `export default ${JSON.stringify(classMap)};`,
        loader: 'js'
      };
    });
    
    // Write CSS file after build
    build.onEnd(async () => {
      if (cssChunks.length > 0) {
        const finalCSS = cssChunks.join('\n\n/* Next module */\n\n');
        const cssFile = path.join(build.initialOptions.outdir, 'modules.css');
        
        await fs.promises.writeFile(cssFile, finalCSS);
        console.log('CSS modules extracted to:', cssFile);
        console.log('Final CSS preview:\n', finalCSS);
        
        cssChunks.length = 0;
      }
    });
  }
};

function watchFiles(callback) {
  const srcDir = path.join(__dirname, 'src');
  
  function watch(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
      const fullPath = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        watch(fullPath);
      } else if (/\.(ts|tsx|js|jsx|css|scss)$/.test(dirent.name)) {
        fs.watchFile(fullPath, { interval: 100 }, callback);
      }
    });
  }
  watch(srcDir);
}

function createDevServer() {
  const clients = new Set();
  
  const server = http.createServer((req, res) => {
    if (req.url === '/hmr') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      clients.add(res);
      res.write('data: connected\n\n');
      req.on('close', () => clients.delete(res));
      return;
    }
    
    const filePath = req.url === '/' ? '/index.html' : req.url;
    const fullPath = path.join(__dirname, 'dist', filePath);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath);
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css'
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
      fs.createReadStream(fullPath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  
  return {
    server,
    broadcast: (msg) => clients.forEach(client => {
      try { client.write(`data: ${msg}\n\n`); }
      catch (e) { clients.delete(client); }
    })
  };
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
      '.css': 'css'
      // No .scss loader - plugin handles it
    },
    jsx: 'automatic',
    define: {
      'process.env.NODE_ENV': isDev ? '"development"' : '"production"',
    },
    sourcemap: isDev,
    minify: !isDev,
    banner: isDev ? {
      js: '(() => { if (typeof window !== "undefined") { const es = new EventSource("/hmr"); es.onmessage = (e) => e.data === "reload" && location.reload(); } })();'
    } : {},
    plugins: [cssModulesPlugin],
  };

  if (isDev) {
    const { server, broadcast } = createDevServer();
    server.listen(3000, () => console.log('-> http://localhost:3000'));
    
    let building = false;
    const rebuild = async () => {
      if (building) return;
      building = true;
      try {
        await esbuild.build(buildOptions);
        console.log('Build complete!');
        broadcast('reload');
      } catch (e) {
        console.error('ERROR', e.message);
      }
      building = false;
    };
    
    await rebuild();
    watchFiles(rebuild);
    
  } else {
    await esbuild.build(buildOptions);
    console.log('Production build complete!');
  }
}

build().catch(console.error);