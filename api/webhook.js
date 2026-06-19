export default async function handler(req, res) {
  // Проверяем, чтобы это был только POST-запрос от Telegram
  if (req.method !== 'POST') {
    return res.status(200).send('Proxy Active');
  }

  const botId = req.query.bot_id;
  // Ссылка на твой сервер Beget
  const targetUrl = `https://hook.bytrox.com/?bot_id=${botId}`;
  
  // Берем секретный ключ из настроек Vercel (Environment Variables)
  // В Vercel Settings -> Environment Variables добавь ключ: X_BYTROX_SECRET
  const secretKey = process.env.X_BYTROX_SECRET;

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Bytrox-Proxy/1.0',
    'x-bytrox-secret': secretKey, // Тот самый ключ для защиты Beget
    'X-Forwarded-For': req.headers['x-forwarded-for'] || ''
  };

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body)
    });

    // Отвечаем Telegram тем же кодом, что прислал Beget
    if (response.ok) {
      return res.status(200).send('OK');
    } else {
      const errorText = await response.text();
      console.error("Beget Error:", errorText);
      return res.status(502).send('Error');
    }
  } catch (err) {
    console.error("Proxy Fetch Error:", err.message);
    return res.status(502).send('Proxy Error');
  }
}
