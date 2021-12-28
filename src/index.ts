import { writeFileSync } from 'fs';
import serialport, { parsers } from 'serialport';
import { mpptObject } from './fields';

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
const data: { [key: string]: any }[] = [];

parser.on('data', (foo) => {
  const [label, value] = foo.split('\t');

  const mpptField = mpptObject[label];

  if (!mpptField) console.log('Unknown label', label, value);

  dataPoint[label] = value;

  if (label === 'Checksum') {
    dataPoint.time = new Date().toISOString();
    data.push(dataPoint);
    dataPoint = {};
  }

  if (data.length === 120) {
    writeFileSync('./output.json', JSON.stringify(data, null, 2));

    parser.end(() => {
      port.close();
    });
  }
});
