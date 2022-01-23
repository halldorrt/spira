import serialport, { parsers } from 'serialport';
import { mpptObject } from './fields';
import { scaleFactory } from './scale';
import { storeMpptValues } from './storeMpptValues';
const scale = scaleFactory();
const maxApi = require('max-api');

maxApi.post('Hello Max!');

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

parser.on('data', (line) => {
  try {
    const [label, value] = line.split('\t');

    const mpptField = mpptObject[label];

    if (!mpptField) console.log('Unknown label', label, value);

    dataPoint[label] = value;

    if (label === 'Checksum') {
      if (packagesSinceLastWrite++ === 0) {
        const { lastPosition, currentPosition } = scale.getPosition(parseFloat(dataPoint.PPV));
        maxApi.outlet(lastPosition, currentPosition);

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
