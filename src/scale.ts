import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

type FileContent = {
  max: number;
};

export const maxValueFileDir = process.env.NODE_ENV === 'test-run' ? './test' : '..';
export const maxValueFilePath = `${maxValueFileDir}/maxValue.json`;

export function scaleFactory() {
  let lastPosition: number | undefined;

  return {
    getPosition(value: number): {
      lastPosition: number;
      currentPosition: number;
    } {
      const previousMax = getCurrentMaxValue();
      const currentMax = value > previousMax ? value : previousMax;
      if (currentMax !== previousMax) saveCurrentMaxValue(currentMax);
      // We want to return a value between 0.5 and 1.0 since those values
      // translate to 0 to 1 in Max MSP speed and brightness
      const currentPosition = value / (currentMax || 1) / 2 + 0.5;
      const result = {
        lastPosition: lastPosition || currentPosition,
        currentPosition: currentPosition,
      };
      lastPosition = currentPosition;
      return result;
    },
  };
}

function getCurrentMaxValue(): number {
  if (existsSync(maxValueFilePath)) {
    const fileBuffer = readFileSync(maxValueFilePath);
    const content: FileContent = JSON.parse(fileBuffer.toString());
    return content.max || Number.MIN_SAFE_INTEGER;
  } else {
    return Number.MIN_SAFE_INTEGER;
  }
}

function saveCurrentMaxValue(max: number): void {
  if (!existsSync(maxValueFileDir)) {
    mkdirSync(maxValueFileDir);
  }
  const content: FileContent = { max };
  writeFileSync(maxValueFilePath, JSON.stringify(content, null, 2));
}
