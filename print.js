const ipp = require('ipp');
const util = require('util');

function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

class Printer {
  constructor(printerUrl) {
    this.printer = ipp.Printer(printerUrl);
    this.execute = util.promisify(this.printer.execute.bind(this.printer));
  }

  async getStatus() {
    const printerStatus = await this.execute('Get-Printer-Attributes', null);

    console.log('Printer state', printerStatus['printer-attributes-tag']);

    this.printerStatus = printerStatus;
  }

  async printerName() {
    if (!this.printerStatus) {
      await this.getStatus();
    }

    return this.printerStatus['printer-name'];
  }

  async isIdle() {
    await this.getStatus();

    return this.printerStatus['printer-state'] === 'idle';
  }

  async printJob(media, data, orientation = 'landscape') {
    const job = await this.execute(
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
          media,
          'orientation-requested': orientation,
        },
        data,
      },
    );

    return {
      ok: job.statusCode === 'successful-ok',
      id: job['job-attributes-tag']['job-id'],
      async cancelJob() {
        return this.cancelJob(job['job-attributes-tag']['job-id']);
      },
      async waitForCompleted() {
        return this.waitForState(job['job-attributes-tag']['job-uri'], 'completed');
      },
    };
  }

  async getJobAttributes(jobUri) {
    const attributes = (await this.execute(
      'Get-Job-Attributes',
      { 'operation-attributes-tag': { 'job-uri': jobUri } },
    ))['job-attributes-tag'];

    return {
      id: attributes['job-id'],
      state: attributes['job-state'],
      attributes,
    };
  }
  async cancelJob(jobId) {
    return this.execute('Cancel-Job', {
      'operation-attributes-tag': {
        // "job-uri":jobUri,  //uncomment this
        //* /
        'printer-uri': this.printer.uri, // or uncomment this two lines - one of variants should work!!!
        'job-id': jobId,
        //* /
      },
    });
  }

  async waitForState(jobUri, desiredState) {
    let tries = 0;
    let job;
    while (tries <= 50) {
      tries += 1;

      // eslint-disable-next-line no-await-in-loop
      job = await this.getJobAttributes(jobUri);

      if (job.state === desiredState) {
        return job;
      }

      // eslint-disable-next-line no-await-in-loop
      await wait(2000);
    }

    throw new Error(`Job did not make it to completed - currently: ${job.state}`);
  }
}

// media = DC07, orientation = landscape
module.exports = async function printJob(printerUrl, bufferToBePrinted, { media, orientation }) {
  const print = new Printer(printerUrl);

  if (await print.isIdle()) {
    const res = await print.printJob(media, bufferToBePrinted, orientation);

    if (res.ok) {
      try {
        return res.waitForCompleted();
      } catch (err) {
        await res.cancelJob();

        console.log(`Job with id ${res.id}is being canceled`);
        throw new Error('Job is canceled - too many tries and job is not printed!');
      }
    } else {
      throw new Error('Error sending job to printer!');
    }
    //* /
  } else {
    throw new Error(`Printer ${await print.printerName()} is not ready!`);
  }
};
