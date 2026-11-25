// Local QA server: serves dist/ and accepts form POSTs to "/" like Netlify Forms.
// Each accepted submission is appended to qa-output/leads.jsonl so tests can prove the lead was saved.
// Set QA_FAIL=1 to simulate a backend outage (used to test the error state).
import { createServer } from 'node:http';
import { readFile, appendFile, mkdir } from 'node:fs/promises';
import { extname, resolve, normalize } from 'node:path';

const dist = resolve(process.cwd(), process.env.QA_DIST || 'dist');
const outDir = resolve(process.cwd(), 'qa-output');
await mkdir(outDir, { recursive: true });
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf', '.txt': 'text/plain' };
const FORMS = new Set(['stall-details', 'exhibitor-enquiry', 'callback-request', 'visitor-registration']);
const port = Number(process.env.PORT || 4321);

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const data = Object.fromEntries(new URLSearchParams(body));
    if (process.env.QA_FAIL === '1') { res.writeHead(503).end('unavailable'); return; }
    if (!FORMS.has(data['form-name'])) { res.writeHead(404).end('unknown form'); return; }
    if (data['bot-field']) { res.writeHead(200).end('ok'); return; } // honeypot: silently dropped
    await appendFile(resolve(outDir, 'leads.jsonl'), JSON.stringify({ received_at: new Date().toISOString(), ...data }) + '\n');
    res.writeHead(200, { 'Content-Type': 'text/html' }).end('<p>Thank you</p>');
    return;
  }
  let p = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (p.endsWith('/')) p += 'index.html';
  try {
    const file = resolve(dist, '.' + p);
    if (!file.startsWith(dist)) throw new Error('outside');
    const buf = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' }).end(buf);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
  }
}).listen(port, () => console.log(`[qa-server] http://localhost:${port}`));
