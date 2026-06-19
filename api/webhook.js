export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Proxy Active');
  }

  const botId = req.query.bot_id;
  const targetUrl = `https://vast-seal-42.webhook.cool/?bot_id=${botId}`;
// В коде JS:
  const secret = process.env.X_BYTROX_SECRET;  // Набор "браузерных" заголовков
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': 'https://telegram.org/',
    'Origin': 'https://telegram.org/',
    'x-byt-sec': secret,
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'X-Forwarded-For': req.headers['x-forwarded-for'] || ''
  };

  try {
    console.log("Proxying to:", targetUrl);
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body)
    });

    const responseText = await response.text();
    console.log("Response from Beget:", responseText);

    if (response.ok) {
      return res.status(200).send('OK from Beget');
    } else {
      return res.status(502).send('Beget returned error: ' + responseText);
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
    return res.status(502).send('Fetch error: ' + err.message);
  }
}
