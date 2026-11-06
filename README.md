# @lp-labs/svg-transform-matrix

Bounded SVG transform-list parser and affine point application for standard 2D transform functions.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/svg-transform-matrix
```

## Working example

```js
import { parseTransform, transformPoint } from '@lp-labs/svg-transform-matrix';
const matrix = parseTransform('translate(10 5) scale(2)');
const point = transformPoint(matrix, { x: 3, y: 4 });
if (point.x !== 16 || point.y !== 13) throw new Error('Unexpected transformed point');
```

CommonJS: `const api = require('@lp-labs/svg-transform-matrix')`.

## Behavior, customization and limits

Parses matrix, translate, scale, rotate (optionally around a center), skewX and skewY with finite numeric arguments. The resulting [a,b,c,d,e,f] matrix uses SVG column-vector transform-list composition; no transform-origin or DOM/CSS integration is included.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export type Matrix = readonly [number, number, number, number, number, number];
export declare function parseTransform(text: string): Matrix;
export declare function transformPoint(
  matrix: Matrix,
  point: {
    readonly x: number;
    readonly y: number;
  },
): {
  x: number;
  y: number;
};
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
