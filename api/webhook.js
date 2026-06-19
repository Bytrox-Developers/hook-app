// api/webhook.js (код для Vercel)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Proxy Active');
  }

  // Получаем bot_id из URL, с которым пришел запрос на Vercel
  const botId = req.query.bot_id; 

  // Твой адрес на Beget
  const targetUrl = `https://webhook.site/e7f274f4-67f7-4855-9a73-d26badf0a6b6?bot_id=${botId}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': req.headers['x-forwarded-for'] || ''
      },
      body: JSON.stringify(req.body)
    });

    return res.status(200).send('OK');
  } catch (err) {
    return res.status(502).send('Error');
  }
}
