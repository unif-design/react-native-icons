import { expect, test } from '@jest/globals';
import { multiply } from '../src/multiply';

test('retained CLI multiplication sample accepts signed and zero values', () => {
  expect(multiply(-3, 7)).toBe(-21);
  expect(multiply(0, 12)).toBe(0);
});
