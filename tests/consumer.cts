import * as api from '@lp-labs/svg-transform-matrix';
import { parseTransform, transformPoint } from '@lp-labs/svg-transform-matrix';
const matrix = parseTransform('translate(10 5) scale(2)');
const point = transformPoint(matrix, { x: 3, y: 4 });
if (point.x !== 16 || point.y !== 13) throw new Error('Unexpected transformed point');
// @ts-expect-error invalid argument must be rejected by declarations
api.parseTransform(4);
