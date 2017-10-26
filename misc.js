
const request = require('request');

// this is some sample code that will scrape the printers from the CUPS web interface

function getPrinterUrls(callback) {
  const CUPSurl = 'http://localhost:631/printers';// todo - change of you have CUPS running on other host
  request(CUPSurl, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const printersMatches = body.match(/<TR><TD><A HREF="\/printers\/([a-zA-Z0-9-^"]+)">/gm);// i know, this is terrible, sorry(
      var printersUrls = [];
      let i;
      if (printersMatches) {
        for (i = 0; i < printersMatches.length; i++) {
          const a = (/"\/printers\/([a-zA-Z0-9-^"]+)"/).exec(printersMatches[i]);
          if (a) {
            printersUrls.push(`${CUPSurl}/${a[1]}`);
          }
        }
      }
    }
    callback(error, printersUrls);
  });
}
