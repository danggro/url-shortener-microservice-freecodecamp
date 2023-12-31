require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('node:dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 5000;
const ips = [
  { original_url: 'https://freeCodeCamp.org', short_url: 1 },
  { original_url: 'https://www.google.com', short_url: 2 },
];
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
  try {
    const { hostname } = new URL(req.body.url);
    const index = ips.findIndex((item) => item.original_url == req.body.url);
    if (index !== -1) {
      return res.json(ips[index]);
    }
    dns.lookup(hostname, (err, add) => {
      if (!err) {
        const temp = {
          original_url: req.body.url,
          short_url: ips.length + 1,
        };
        ips.push(temp);
        return res.json(temp);
      } else {
        return res.json({ error: 'Invalid URL' });
      }
    });
  } catch (error) {
    return res.json({ error: 'Invalid URL' });
  }
});

app.get('/api/shorturl/:number', function (req, res) {
  console.log(req.params.number);
  const number = req.params.number;
  const ipShort = ips.filter((item) => item.short_url == number)[0];
  if (isNaN(parseInt(number))) return res.json({ error: 'wrong format' });
  if (ipShort == undefined)
    return res.json({ error: 'No short URL found for the given input' });
  return res.redirect(ipShort['original_url']);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
