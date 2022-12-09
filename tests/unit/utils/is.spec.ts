import { describe, it, expect } from 'vitest';
import { isFunction, isRegExp, isString } from '../../../src/utils/is';

describe('is.ts', () => {
  //isRegExp
  it('isRegExp: input => RegExp => true', () => {
    expect(isRegExp(/[1-5]/)).toBeTruthy();
  })

  it('isRegExp: input => no RegExp => false', () => {
    expect(isRegExp(12)).not.toBeTruthy();
  })

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
