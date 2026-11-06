export type Matrix = readonly [number, number, number, number, number, number];
function multiply(x: Matrix, y: Matrix): Matrix {
  const [a, b, c, d, e, f] = x,
    [g, h, i, j, k, l] = y;
  return [
    a * g + c * h,
    b * g + d * h,
    a * i + c * j,
    b * i + d * j,
    a * k + c * l + e,
    b * k + d * l + f,
  ];
}
export function parseTransform(text: string): Matrix {
  if (typeof text !== 'string' || text.length > 4096)
    throw new TypeError('Expected bounded transform text');
  const pattern = /([A-Za-z]+)\s*\(([^()]*)\)/g;
  let cursor = 0,
    m: RegExpExecArray | null,
    result: Matrix = [1, 0, 0, 1, 0, 0],
    found = false;
  while ((m = pattern.exec(text)) !== null) {
    if (text.slice(cursor, m.index).replace(/[\s,]/g, '') !== '')
      throw new TypeError('Malformed transform list');
    cursor = pattern.lastIndex;
    found = true;
    const args = m[2]!.trim()
      ? m[2]!
          .trim()
          .split(/[\s,]+/)
          .map(Number)
      : [];
    if (args.some((v) => !Number.isFinite(v)))
      throw new TypeError('Transform arguments must be finite');
    let op: Matrix;
    const name = m[1]!;
    if (name === 'matrix' && args.length === 6)
      op = [args[0]!, args[1]!, args[2]!, args[3]!, args[4]!, args[5]!];
    else if (name === 'translate' && (args.length === 1 || args.length === 2))
      op = [1, 0, 0, 1, args[0]!, args[1] ?? 0];
    else if (name === 'scale' && (args.length === 1 || args.length === 2))
      op = [args[0]!, 0, 0, args[1] ?? args[0]!, 0, 0];
    else if (name === 'rotate' && (args.length === 1 || args.length === 3)) {
      const r = (args[0]! * Math.PI) / 180,
        c = Math.cos(r),
        s = Math.sin(r),
        rot: Matrix = [c, s, -s, c, 0, 0];
      op =
        args.length === 1
          ? rot
          : multiply(multiply([1, 0, 0, 1, args[1]!, args[2]!], rot), [
              1,
              0,
              0,
              1,
              -args[1]!,
              -args[2]!,
            ]);
    } else if ((name === 'skewX' || name === 'skewY') && args.length === 1) {
      const t = Math.tan((args[0]! * Math.PI) / 180);
      op = name === 'skewX' ? [1, 0, t, 1, 0, 0] : [1, t, 0, 1, 0, 0];
    } else throw new TypeError('Unsupported transform or argument count');
    result = multiply(result, op);
  }
  if (text.slice(cursor).replace(/[\s,]/g, '') !== '' || !found)
    throw new TypeError('Malformed or empty transform list');
  return result;
}
export function transformPoint(
  matrix: Matrix,
  point: { readonly x: number; readonly y: number },
): { x: number; y: number } {
  if (
    matrix.length !== 6 ||
    [...matrix, point.x, point.y].some((v) => typeof v !== 'number' || !Number.isFinite(v))
  )
    throw new TypeError('Expected finite matrix and point');
  const [a, b, c, d, e, f] = matrix;
  return { x: a * point.x + c * point.y + e, y: b * point.x + d * point.y + f };
}
