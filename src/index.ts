import serialport, { parsers } from 'serialport';
import { mpptObject } from './fields';
import { storeMpptValues } from './storeMpptValues';
const maxApi = require('max-api');

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
let lastValue: number | undefined;

parser.on('data', (line) => {
  try {
    const [label, value] = line.split('\t');

    const mpptField = mpptObject[label];

    if (!mpptField) console.log('Unknown label', label, value);

    dataPoint[label] = value;

    if (label === 'Checksum') {
      if (packagesSinceLastWrite++ === 0) {
        const value = parseFloat(dataPoint.PPV);

        if (lastValue === undefined) maxApi.outlet(lastValue, value);
        else maxApi.outlet(1);
        lastValue = value;

        try {
          storeMpptValues(dataPoint);
        } catch (e) {
          console.log('failed to store Mppt values', e);
          maxApi.post('Failed to store Mppt values', e);
        }
      }
      if (packagesSinceLastWrite === 10) packagesSinceLastWrite = 0;
      dataPoint = {};
    }
  } catch (e) {
    console.log('on data handler failed', e);
    maxApi.post('on data handler failed', e);
  }
});
