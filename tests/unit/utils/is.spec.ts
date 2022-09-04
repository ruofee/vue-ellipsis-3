import { describe, it, expect } from 'vitest';
import { isFunction, isNull, isString } from '../../../src/utils/is';

describe('is.ts', () => {
  // isNull
  it('isNull: input => null => true', () => {
    expect(isNull(null)).toBeTruthy();
  });

  it('isNull: input => not null => false', () => {
    const arr = ['', undefined, false, 12, () => {}, [], {}];

    arr.forEach((item) => {
      expect(isNull(item)).not.toBeTruthy();
    });
  });

  // isString
  it('isString: input => string => true', () => {
    expect(isString('')).toBeTruthy();
  });

  it('isString: input => not string => false', () => {
    const arr = [null, undefined, false, 12, () => {}, [], {}];

    arr.forEach((item) => {
      expect(isString(item)).not.toBeTruthy();
    });
  });

  // isFunction
  it('isFunction: input => function => true', () => {
    expect(isFunction(() => {})).toBeTruthy();
  });

  it('isFunction: input => not function => false', () => {
    const arr = [null, undefined, false, 12, '', [], {}];

    arr.forEach((item) => {
      expect(isFunction(item)).not.toBeTruthy();
    });
  });
});
