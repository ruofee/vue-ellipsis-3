import { describe, it, expect } from 'vitest';
import { wrapTextChildNodesWithSpan } from '../../../src/utils/dom';
import { createDiv } from '../../utils';

describe('dom.ts', () => {
  it('wrapTextChildNodesWithSpan', () => {
    const div = createDiv();
    div.innerHTML = '7777';
    wrapTextChildNodesWithSpan(div);
    expect(/vue-ellipsis-js-content-text/.test(div.innerHTML)).toBeTruthy();
  });
});
