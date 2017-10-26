const fs = require('fs');
const util = require('util');

const print = require('./print');

const readFile = util.promisify(fs.readFile);

const printer = process.env.PRINTER;

(async () => {
  try {
    const data = await readFile('output.pdf');
    const job = await print(`http://localhost:631/printers/${encodeURIComponent(printer)}`, data);

    console.log('Printed. Job parameters are: ');
    console.log(job);
  } catch (err) {
    console.error('Error printing');
    console.error(err);
  }
})();
