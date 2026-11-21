// Vercel Serverless Function → POST /api/lead
const { handleLead } = require('./lead-core');
module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'Method not allowed' }); }
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const { status, body: out } = await handleLead({ body, ip, origin: req.headers.origin || '', host: req.headers.host || '' });
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(out);
};
