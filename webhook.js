const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3005;

// Your secret from GitHub
const SECRET = 'my-secret-123';

// GitHub sends JSON, so we need raw body to verify signature
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Webhook endpoint
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const payload = req.rawBody;

  const hmac = crypto.createHmac('sha256', SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  if (signature !== digest) {
    console.log('❌ Signature mismatch');
    return res.status(401).send('Invalid signature');
  }

  console.log('✅ Valid webhook received');
  console.log('Event:', req.headers['x-github-event']);
  console.log('Payload:', req.body);

  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
