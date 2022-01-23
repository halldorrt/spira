import { existsSync, readFileSync, unlinkSync } from 'fs';
import { maxValueFilePath, scaleFactory } from './scale';

describe('getPosition', () => {
  beforeEach(() => {
    if (existsSync(maxValueFilePath)) unlinkSync(maxValueFilePath);
  });

  test('getPosition - Input is zero and is the first value in the scale - Should return 0 for both scale positions', () => {
    // Arrange
    const scale = scaleFactory();
    const value = 0;

    // Act
    const { lastPosition, currentPosition } = scale.getPosition(value);

    // Assert
    expect(lastPosition).toBe(0);
    expect(currentPosition).toBe(0);
  });

  test('getPosition - Input is greater than zero and is the first value in the scale -  Should return 1.0 for both scale positions', () => {
    // Arrange
    const scale = scaleFactory();
    const value = 100 + Math.random() * 300;

    // Act
    const { lastPosition, currentPosition } = scale.getPosition(value);

    // Assert
    expect(lastPosition).toBe(1);
    expect(currentPosition).toBe(1);
  });

  test('getPosition - current value is 31, last value was 17, max value seen is 45 - Should return lastPosition 17/45 and currentPosition 31/45', () => {
    // Arrange
    const scale = scaleFactory();
    [1, 15, 45, 21, 3, 17].forEach((value) => scale.getPosition(value));

    // Act
    const { lastPosition, currentPosition } = scale.getPosition(31);

    // Assert
    expect(lastPosition).toBe(17 / 45);
    expect(currentPosition).toBe(31 / 45);
  });

  test('getPosition - current value is 0, last value was 17, max value seen is 45 - Should return lastPosition 17/45 and currentPosition 0', () => {
    // Arrange
    const scale = scaleFactory();
    [1, 15, 45, 21, 3, 17].forEach((value) => scale.getPosition(value));

    // Act
    const { lastPosition, currentPosition } = scale.getPosition(0);

    // Assert
    expect(lastPosition).toBe(17 / 45);
    expect(currentPosition).toBe(0);
  });

  test('getPosition - Six values added to scale - Max value file should contain largest of the six values', () => {
    // Arrange
    const scale = scaleFactory();
    [1, 15, 45, 21, 3, 17].forEach((value) => scale.getPosition(value));

    // Act
    const fileBuffer = readFileSync(maxValueFilePath);
    const fileContent = JSON.parse(fileBuffer.toString());

    // Assert
    expect(fileContent).toEqual({ max: 45 });
  });
});
