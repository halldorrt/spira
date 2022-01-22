import * as dotenv from 'dotenv';
import serialport, { parsers } from 'serialport';
import { mpptObject } from './fields';
import { storeMpptValues } from './storeMpptValues';
const maxApi = require('max-api');
dotenv.config();

maxApi.post({ printLines: process.env.print_lines });

const parser = new parsers.Readline({
  delimiter: '\r\n',
  includeDelimiter: false,
  encoding: 'ascii',
})
  .on('error', (e) => {
    console.log('ReadLine parser encountered an error:');
    console.log(e);
  })
  .on('end', () => {
    console.log('ReadLine parser ended');
  });

const port = new serialport(
  '/dev/tty.usbserial-VE53UPJX',
  {
    baudRate: 19200,
  },
  (e) => {
    if (!e) return;
    console.log('Serial port initialization error:');
    console.log(e);
  }
)
  .on('error', (e) => {
    console.log('Serial port encountered an error:');
    console.log(e);
  })
  .on('close', () => console.log('Serial port closed'))
  .on('end', () => console.log('Serial port ended'));
port.pipe(parser);

let dataPoint: { [key: string]: any } = {};
let packagesSinceLastWrite = 0;
let lastValue = 0;

parser.on('data', (line) => {
  try {
    if (process.env.print_lines === 'true') maxApi.post({ line });
    const [label, value] = line.split('\t');

    const mpptField = mpptObject[label];

    if (!mpptField) console.log('Unknown label', label, value);

    dataPoint[label] = value;

    if (label === 'Checksum') {
      if (packagesSinceLastWrite++ === 0) {
        maxApi.post({ PPV: dataPoint.PPV });
        const value = parseFloat(dataPoint.PPV);

        const maxMspValue =
          process.env.NODE_ENV === 'debug' ? value + Math.random() * 0.5 + 0.5 : value;

        if (lastValue) maxApi.outlet(lastValue, maxMspValue);
        else maxApi.outlet(1);
        lastValue = maxMspValue;

        storeMpptValues(dataPoint);
      }
      if (packagesSinceLastWrite === 10) packagesSinceLastWrite = 0;
      dataPoint = {};
    }
  } catch (e) {
    maxApi.post(e);
  }
});
