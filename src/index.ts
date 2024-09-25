import { SerialPort, ReadlineParser } from 'serialport';
import { mpptObject } from './fields';
import { logger } from './logger';
import { scaleFactory } from './scale';
import { storeMpptValues } from './storeMpptValues';
const scale = scaleFactory();

let maxApi: any;
try {
  maxApi = require('max-api');
} catch {}

logger.log('Hello Max!');

const parser = new ReadlineParser({
  delimiter: '\r\n',
  includeDelimiter: false,
  encoding: 'ascii',
})
  .on('error', (e) => logger.log('ReadLine parser encountered an error:', e))
  .on('end', () => logger.log('ReadLine parser ended'));

try {
  const port = new SerialPort(
    {
      path: '/dev/tty.usbserial-VE53UPJX',
      baudRate: 19200,
    },
    (e) => {
      if (!e) return;
      logger.log('Serial port initialization error:', e);
    }
  )
    .on('error', (e) => {
      logger.log('Serial port encountered an error:', e);
    })
    .on('close', () => logger.log('Serial port closed'))
    .on('end', () => logger.log('Serial port ended'));
  port.pipe(parser);
} catch (e) {
  logger.log('port open failed with message:', e);
}

let dataPoint: { [key: string]: any } = {};
let packagesSinceLastWrite = 0;

parser.on('data', (line) => {
  try {
    const [label, value] = line.split('\t');

    const mpptField = mpptObject[label];

    if (!mpptField) logger.log('Unknown label', label, value);

    dataPoint[label] = value;

    if (label === 'Checksum') {
      if (packagesSinceLastWrite++ === 0) {
        const { lastPosition, currentPosition } = scale.getPosition(parseFloat(dataPoint.PPV));
        maxApi.outlet(lastPosition, currentPosition);

        try {
          storeMpptValues(dataPoint);
        } catch (e) {
          logger.log('failed to store Mppt values', e);
        }
      }
      if (packagesSinceLastWrite === 10) packagesSinceLastWrite = 0;
      dataPoint = {};
    }
  } catch (e) {
    logger.log('on data handler failed', e);
  }
});
