import { existsSync, readFileSync, unlinkSync } from 'fs';
import { maxValueFilePath, scaleFactory } from './scale';

describe('getPosition', () => {
  beforeEach(() => {
    if (existsSync(maxValueFilePath)) unlinkSync(maxValueFilePath);
  });

  test('getPosition - Input is zero and is the first value in the scale - Should return scale minimum, 0.5, for both scale positions', () => {
    // Arrange
    const scale = scaleFactory();
    const value = 0;

    // Act
    const { lastPosition, currentPosition } = scale.getPosition(value);

    // Assert
    expect(lastPosition).toBe(0.5);
    expect(currentPosition).toBe(0.5);
  });

  test('getPosition - Input is greater than zero and is the first value in the scale -  Should return scale maximum, 1.0, for both scale positions since input is the highest number ever seen', () => {
    // Arrange
    const scale = scaleFactory();
    const value = 100 + Math.random() * 300;

    // Act
    const { lastPosition, currentPosition } = scale.getPosition(value);

    // Assert
    expect(lastPosition).toBe(1);
    expect(currentPosition).toBe(1);
  });

  test('getPosition - Six values added to scale - Max value file should contain largest of the six values', () => {
    // Arrange
    const scale = scaleFactory();
    [1, 15, 45, 21, 3, 5].forEach((value) => scale.getPosition(value));

    // Act
    const fileBuffer = readFileSync(maxValueFilePath);
    const fileContent = JSON.parse(fileBuffer.toString());

    // Assert
    expect(fileContent).toEqual({ max: 45 });
  });

  test('getPosition - current value is 5, last value was 6, max value seen is 10 - Should return lastPosition 0.8 and currentPosition 0.75', () => {
    // Arrange
    const scale = scaleFactory();
    [1, 5, 10, 6].forEach((value) => scale.getPosition(value));

    // Act
    const { lastPosition, currentPosition } = scale.getPosition(5);

    // Assert
    expect(lastPosition).toBe(0.8);
    expect(currentPosition).toBe(0.75);
  });

  test('getPosition - current value is 0, last value was 6, max value seen is 10 - Should return lastPosition 0.8 and currentPosition 0.5', () => {
    // Arrange
    const scale = scaleFactory();
    [1, 5, 10, 6].forEach((value) => scale.getPosition(value));

    // Act
    const { lastPosition, currentPosition } = scale.getPosition(0);

    // Assert
    expect(lastPosition).toBe(0.8);
    expect(currentPosition).toBe(0.5);
  });
});
