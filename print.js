const ipp = require('ipp');
const util = require('util');

function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

module.exports = async function doPrintOnSelectedPrinter(printerUrl, bufferToBePrinted) {
  const printer = ipp.Printer(printerUrl);

  const execute = util.promisify(printer.execute.bind(printer));

  const printerStatus = await execute('Get-Printer-Attributes', null);

  if (printerStatus['printer-attributes-tag']['printer-state'] === 'idle') {
    // printer ready to work
    //* /
    const res = await execute(
      'Print-Job',
      {
        'operation-attributes-tag': {
          'requesting-user-name': 'nap',
          'job-name': 'testing',
          'document-format': 'application/pdf',
        },
        'job-attributes-tag': {
          copies: 1,
          sides: 'one-sided',
          media: 'DC07',
          'orientation-requested': 'landscape',
        },
        data: bufferToBePrinted,
      },
    );

    if (res.statusCode === 'successful-ok') {
      const jobUri = res['job-attributes-tag']['job-uri'];
      let tries = 0;

      let job;

      while (tries <= 50) {
        tries += 1;

        // eslint-disable-next-line no-await-in-loop
        job = await execute(
          'Get-Job-Attributes',
          { 'operation-attributes-tag': { 'job-uri': jobUri } },
        );

        if (job && job['job-attributes-tag']['job-state'] === 'completed') {
          return job;
        }

        // eslint-disable-next-line no-await-in-loop
        await wait(2000);
      }

      await execute('Cancel-Job', {
        'operation-attributes-tag': {
          // "job-uri":jobUri,  //uncomment this
          //* /
          'printer-uri': printer.uri, // or uncomment this two lines - one of variants should work!!!
          'job-id': job['job-attributes-tag']['job-id'],
          //* /
        },
      });

      console.log(`Job with id ${job['job-attributes-tag']['job-id']}is being canceled`);
      throw new Error('Job is canceled - too many tries and job is not printed!');
    } else {
      throw new Error('Error sending job to printer!');
    }
    //* /
  } else {
    throw new Error(`Printer ${printerStatus['printer-attributes-tag']['printer-name']} is not ready!`);
  }
};
