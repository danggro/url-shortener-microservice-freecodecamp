require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('node:dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const ips = [];
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  const url = req.body.url.replace(/^https?:\/\//i, '');
  if (!req.body.url.includes('http')) {
    return res.json({ error: 'Invalid URL' });
  }
  dns.lookup(url, (err, address) => {
    if (address !== undefined) {
      const temp = { original_url: req.body.url, short_url: ips.length + 1 };
      ips.push(temp);
      return res.json(temp);
    }
    return res.json({ error: 'Invalid URL' });
  });
});

app.get('/api/shorturl/:number', function (req, res) {
  const number = req.params.number;
  const ipShort = ips.filter((item) => item.short_url == number)[0];

  res.redirect(ipShort.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
