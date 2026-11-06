import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('identity transform', () => {
  assert.deepEqual(api.transformPoint(api.parseTransform('matrix(1 0 0 1 0 0)'), { x: 2, y: 3 }), {
    x: 2,
    y: 3,
  });
});
test('translates then scales according to SVG composition', () => {
  assert.deepEqual(
    api.transformPoint(api.parseTransform('translate(10 5) scale(2)'), { x: 3, y: 4 }),
    { x: 16, y: 13 },
  );
});
test('supports centered rotation', () => {
  const p = api.transformPoint(api.parseTransform('rotate(90 1 1)'), { x: 2, y: 1 });
  assert.ok(Math.abs(p.x - 1) < 1e-12 && Math.abs(p.y - 2) < 1e-12);
});
test('supports skew', () => {
  const p = api.transformPoint(api.parseTransform('skewX(45)'), { x: 0, y: 2 });
  assert.ok(Math.abs(p.x - 2) < 1e-12);
});
test('supports composed scale', () => {
  assert.deepEqual(api.transformPoint(api.parseTransform('scale(2 3)'), { x: 4, y: 5 }), {
    x: 8,
    y: 15,
  });
});
test('rejects unknown and malformed functions', () => {
  assert.throws(() => api.parseTransform('rotate(10) unknown(2)'), TypeError);
  assert.throws(() => api.parseTransform('scale(1'), TypeError);
});
