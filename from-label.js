const fs = require('fs');
const PDFDocument = require('pdfkit');
const streamBuffers = require('stream-buffers');

const print = require('./print');

const printer = process.env.PRINTER;

const doc = new PDFDocument({ autoFirstPage: false });

const myWritableStreamBuffer = new streamBuffers.WritableStreamBuffer({
  initialSize: (100 * 1024), // start at 100 kilobytes.
  incrementAmount: (10 * 1024), // grow by 10 kilobytes each time buffer overflows.
});

doc.pipe(myWritableStreamBuffer);

doc.addPage({
  size: [175, 283],
  layout: 'landscape',
  margin: 18,
});

const address = fs.readFileSync('from-address.txt').toUpperCase();

// Draw some text wrapped to 412 points wide
doc.font('./fonts/RobotoCondensed-Regular.ttf', 14)
  .text('\nFROM\n\n', {
    width: 247, align: 'left', indent: 0, paragraphGap: 0,
  })
  .font('./fonts/RobotoCondensed-Light.ttf', 14)
  .fontSize(18)
  .text(address, {
    width: 247, align: 'left', indent: 0, paragraphGap: 0,
  });

doc.on('end', async () => {
  try {
    const data = myWritableStreamBuffer.getContents();
    const job = await print(`http://localhost:631/printers/${encodeURIComponent(printer)}`, data);

    console.log('Printed. Job parameters are: ');
    console.log(job);
  } catch (err) {
    console.error('Error printing');
    console.error(err);
  }
});

doc.end();
