export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Proxy Active');
  }

  const botId = req.query.bot_id;
  const targetUrl = `https://webhook.site/e7f274f4-67f7-4855-9a73-d26badf0a6b6?bot_id=${botId}`;

  try {
    // ВАЖНО: Добавляем логгирование
    console.log("Proxying to:", targetUrl);
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
