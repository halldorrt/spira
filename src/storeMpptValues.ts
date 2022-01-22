import { existsSync, mkdirSync, writeFileSync } from 'fs';

let lastReport = 0;
const baseDir = '../output';

export function storeMpptValues(dataPoint: { [key: string]: any }) {
  if (lastReport++ === 0) {
    if (!existsSync(baseDir)) {
      mkdirSync(baseDir);
    }
    const time = new Date().toISOString();
    const date = time.slice(0, 10);

    const dir = `${baseDir}/${date}`;
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }

    const dataWithTime = { ...dataPoint, time };
    writeFileSync(`${dir}/${time}.json`, JSON.stringify(dataWithTime));
  }
  if (lastReport === 6) lastReport = 0;
}
