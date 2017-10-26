const fs = require('fs');
const PDFDocument = require('pdfkit');

const doc = new PDFDocument({ autoFirstPage: false });

doc.pipe(fs.createWriteStream('output.pdf'));

doc.addPage({
  size: [175, 283],
  layout: 'landscape',
  margin: 18,
});

const name = process.env.NAME;

const address = `${process.env.ADDRESS_LINE_1}
${process.env.ADDRESS_LINE_2}`.toUpperCase();

// Draw some text wrapped to 412 points wide
doc.font('./fonts/RobotoCondensed-Bold.ttf', 18)
  .text(`\n${name}\n\n`.toUpperCase(), {
    width: 247, align: 'left', indent: 0, paragraphGap: 0,
  });

doc.font('./fonts/RobotoCondensed-Light.ttf', 20)
  .text(address, {
    width: 247, align: 'left', indent: 0, paragraphGap: 0,
  });


doc.end();

