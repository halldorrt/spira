import { existsSync, mkdirSync, writeFileSync } from 'fs';

let lastReport = 0;
const dir = './output';

export function storeMpptValues(dataPoint: { [key: string]: any }) {
  if (lastReport++ === 0) {
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
    const time = new Date().toISOString();
    const dataWithTime = { ...dataPoint, time };
    writeFileSync(`${dir}/${time}.json`, JSON.stringify(dataWithTime));
  }
  if (lastReport === 6) lastReport = 0;
}
