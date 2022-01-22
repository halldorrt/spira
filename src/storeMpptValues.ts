import { existsSync, readFileSync, writeFileSync } from 'fs';

export function storeMpptValues(dataPoint: { [key: string]: any }) {
  let previousValues: { [key: string]: any }[] = [];
  if (existsSync('../output.json')) {
    const fileBuffer = readFileSync('../output.json');
    previousValues = JSON.parse(fileBuffer.toString()) as { [key: string]: any }[];
  }
  previousValues.push(dataPoint);
  writeFileSync('../output.json', JSON.stringify(previousValues, null, 2));
}
