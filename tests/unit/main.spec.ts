import { describe, it, expect } from 'vitest';
import Install, { VueEllipsis3 } from '../../src';

describe('main.ts', () => {
  it('Global Install', () => {
    expect(Install).not.toBeUndefined();
  });

  it('Single Component Install', () => {
    expect(VueEllipsis3).not.toBeUndefined();
  });
});
