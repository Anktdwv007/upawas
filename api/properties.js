// Vercel Serverless Function for Global Property Live Storage Sync
let globalUserProperties = [];

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, properties: globalUserProperties });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body && body.property) {
        globalUserProperties = [body.property, ...globalUserProperties.filter((p) => p.id !== body.property.id)];
        return res.status(200).json({ success: true, properties: globalUserProperties });
      }
    } catch (e) {
      return res.status(400).json({ success: false, error: 'Invalid payload' });
    }
  }

  return res.status(200).json({ success: true, properties: globalUserProperties });
}
