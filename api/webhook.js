export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Proxy Active');
  }

  const botId = req.query.bot_id;
  const targetUrl = `https://hook.bytrox.com/?bot_id=${botId}`;

  // Забираем секреты из Vercel Environment Variables
  const clientId = process.env.cfaccessclientid;
  const clientSecret = process.env.cfaccessclient;

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Bytrox-Proxy/1.0',
    // Добавляем заголовки для Cloudflare Access
    'CF-Access-Client-Id': clientId,
    'CF-Access-Client-Secret': clientSecret,
    // Остальные заголовки
    'X-Forwarded-For': req.headers['x-forwarded-for'] || ''
  };

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body)
    });

    if (response.ok) {
      return res.status(200).send('OK');
    } else {
      const errorText = await response.text();
      console.error("Cloudflare Access Error:", errorText);
      return res.status(502).send('Access Denied or Proxy Error');
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
    return res.status(502).send('Fetch error');
  }
}
