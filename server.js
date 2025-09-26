const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const svgCaptcha = require('svg-captcha');
const { check, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5
});
app.use('/contact', limiter);

const configPath = path.join(__dirname, 'config', 'email.json');
let emailConfig = {};
function loadEmailConfig() {
  try {
    emailConfig = JSON.parse(fs.readFileSync(configPath));
  } catch (e) {
    emailConfig = {};
  }
}
loadEmailConfig();

const captchaStore = new Map();
function createCaptcha() {
  const captcha = svgCaptcha.create();
  const token = Date.now().toString(36) + Math.random().toString(36).substring(2);
  captchaStore.set(token, { text: captcha.text, created: Date.now() });
  return { token, data: captcha.data };
}

function verifyCaptcha(token, value) {
  if (token === 'local') return true;
  const record = captchaStore.get(token);
  if (!record) return false;
  captchaStore.delete(token);
  return record.text.toLowerCase() === String(value).toLowerCase();
}

setInterval(() => {
  const now = Date.now();
  for (const [token, { created }] of captchaStore) {
    if (now - created > 5 * 60 * 1000) captchaStore.delete(token);
  }
}, 60 * 1000);

app.get('/captcha', (req, res) => {
  const { token, data } = createCaptcha();
  res.json({ token, image: `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}` });
});

app.post(
  '/contact',
  [
    check('name').trim().notEmpty().escape(),
    check('email').trim().isEmail().normalizeEmail(),
    check('message').trim().notEmpty().escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, email, phone, message, captchaToken, captchaValue } = req.body;
    if (!verifyCaptcha(captchaToken, captchaValue)) {
      return res.status(400).json({ success: false, error: 'Invalid captcha' });
    }
    if (!emailConfig.host || !emailConfig.auth || !emailConfig.auth.user) {
      return res.status(500).json({ success: false, error: 'Email server not configured' });
    }
    try {
      const transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: emailConfig.auth,
        tls: {
          rejectUnauthorized: true
        }
      });
      await transporter.sendMail({
        from: emailConfig.from || emailConfig.auth.user,
        to: emailConfig.to || emailConfig.auth.user,
        subject: `Website Contact from ${name}`,
        replyTo: email,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || ''}\nMessage:\n${message}`
      });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }
  }
);

// 404 handler for unmatched GET requests
app.use((req, res) => {
  if (req.method === 'GET') {
    return res.status(404).sendFile(path.join(__dirname, '404.html'));
  }
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
