#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const { exec } = require('child_process');

const STARTING_PORT = 7337;
const __dir = __dirname;

// --- SSE client registry ---
let sseClients = [];

function notifyClients() {
  sseClients = sseClients.filter(res => {
    try {
      res.write('data: reload\n\n');
      return true;
    } catch {
      return false;
    }
  });
}

// --- Find a free port ---
function findFreePort(start) {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.listen(start, '127.0.0.1', () => {
      const port = probe.address().port;
      probe.close(() => resolve(port));
    });
    probe.on('error', () => findFreePort(start + 1).then(resolve).catch(reject));
  });
}

// --- MIME types ---
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.ttf':  'font/truetype',
  '.md':   'text/plain; charset=utf-8',
};

// --- Request handler ---
function createHandler(filePath) {
  return function handler(req, res) {
    const url = req.url.split('?')[0];

    if (url === '/') {
      const html = fs.readFileSync(path.join(__dir, 'viewer.html'), 'utf8');
      const filename = path.basename(filePath);
      const injected = html.replace('__FILENAME__', filename);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(injected);
      return;
    }

    if (url === '/content') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('File not found');
      }
      return;
    }

    if (url === '/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });
      res.write('data: connected\n\n');
      sseClients.push(res);
      req.on('close', () => {
        sseClients = sseClients.filter(c => c !== res);
      });
      return;
    }

    if (url.startsWith('/fonts/')) {
      const fontName = path.basename(url);
      const fontPath = path.join(__dir, 'fonts', fontName);
      if (fs.existsSync(fontPath)) {
        res.writeHead(200, { 'Content-Type': 'font/truetype' });
        fs.createReadStream(fontPath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Font not found');
      }
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  };
}

// --- Main ---
async function main() {
  const arg = process.argv[2];

  if (!arg || arg === '--help' || arg === '-h') {
    console.log('Usage: md-view <file.md>');
    console.log('       npx md-view <file.md>');
    process.exit(arg ? 0 : 1);
  }

  const filePath = path.resolve(arg);

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const port = await findFreePort(STARTING_PORT);
  const server = http.createServer(createHandler(filePath));

  server.listen(port, '127.0.0.1', () => {
    const url = `http://localhost:${port}`;
    console.log(`Viewing: ${filePath}`);
    console.log(`Open:    ${url}`);
    console.log('Press Ctrl+C to stop.');
    exec(`open "${url}"`);
  });

  // Watch the file for changes
  let watchDebounce = null;
  fs.watch(filePath, () => {
    clearTimeout(watchDebounce);
    watchDebounce = setTimeout(notifyClients, 50);
  });

  process.on('SIGINT', () => {
    server.close();
    process.exit(0);
  });
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
