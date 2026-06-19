export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Webhook Proxy Active');
  }

  // Пересылаем на твой сервер
  const targetUrl = "https://webhook.site/e7f274f4-67f7-4855-9a73-d26badf0a6b6/" + (req.url.split('?')[1] ? '?' + req.url.split('?')[1] : '');
  
  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });

  return res.status(200).send('OK');
}
