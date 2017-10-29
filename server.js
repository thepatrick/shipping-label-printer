const bodyParser = require('body-parser');
const express = require('express');
const print = require('./print');

const printer = process.env.PRINTER;
const printerUrl = `http://localhost:631/printers/${encodeURIComponent(printer)}`;

const app = express();

app.use(bodyParser.json());

const { fromLabel } = require('./server-label');

app.post('/v1/print/from-label', async (req, res) => {
  const label = await fromLabel();
  try {
    const job = await print(printerUrl, label, { media: 'DC07', orientation: 'landscape' });
    res.send({
      ok: true,
      job: job.id,
      state: job.state,
    });
  } catch (err) {
    res.statusCode = 500;
    res.send({ error: err.message });
  }
});

app.get('/v1/preview/from-label', async (req, res) => {
  const label = await fromLabel();

  res.setHeader('Content-Type', 'application/pdf');
  res.send(label);
});

app.post('/v1/print', async (req, res) => {
  try {
    const job = await print(`http://localhost:631/printers/${encodeURIComponent(printer)}`, Buffer.from('hello'), { media: 'DC07', orientation: 'landscape' });
    res.send({
      ok: true,
      job: job.id,
      state: job.state,
    });
  } catch (err) {
    res.statusCode = 500;
    res.send({ error: err.message });
  }
});

app.listen(process.env.PORT || 8080);
