// Evaluator for ExamView algorithmic expressions as they appear in graph objects:
// function bodies ("2*x-4"), coordinates ("(n3-n1)/k"), domains ("-inf"), display
// conditions ("n2>4") and text-box strings (`str(n3_disp)+"..."`).
//
// Precedence follows ExamView's help ("Algorithmic Syntax"), highest first:
//   ( )   ! + - (factorial, unary plus/minus)   ^   * / \ %   + -   < <= > >=   = <>   &   |
// Unary minus binds tighter than ^, so -2^2 is 4. Graph expressions in the corpus are
// verified against ExamView's own rendered metafiles (scripts/research/compare-graphs.mjs).

export type Value = number | string;

export interface Scope {
  /** Bound variables (x, y, t, theta) and algorithm variables. */
  lookup(name: string): Value | undefined;
}

export class ExpressionError extends Error {}

type Node =
  | { t: 'num'; v: number }
  | { t: 'str'; v: string }
  | { t: 'id'; name: string }
  | { t: 'call'; name: string; args: Node[] }
  | { t: 'un'; op: string; a: Node }
  | { t: 'fact'; a: Node }
  | { t: 'bin'; op: string; a: Node; b: Node };

const cache = new Map<string, Node>();

export function parseExpression(source: string): Node {
  const cached = cache.get(source);
  if (cached) return cached;
  const tokens = tokenize(source);
  let p = 0;
  const peek = () => tokens[p];
  const take = (value?: string) => {
    const token = tokens[p];
    if (value !== undefined && token?.v !== value) throw new ExpressionError(`expected ${value} in "${source}"`);
    p++;
    return token;
  };
  const isOp = (...ops: string[]) => peek()?.k === 'op' && ops.includes(peek()!.v as string);
  const isWord = (...words: string[]) => peek()?.k === 'id' && words.includes(String(peek()!.v).toLowerCase());
  const binary = (next: () => Node, ops: string[], words: string[] = [], alias: Record<string, string> = {}): (() => Node) => () => {
    let a = next();
    while (isOp(...ops) || isWord(...words)) {
      const raw = String(take().v).toLowerCase();
      a = { t: 'bin', op: alias[raw] ?? raw, a, b: next() };
    }
    return a;
  };
  const primary = (): Node => {
    const token = take();
    if (!token) throw new ExpressionError(`unexpected end of "${source}"`);
    if (token.k === 'num') return { t: 'num', v: token.v as number };
    if (token.k === 'str') return { t: 'str', v: token.v as string };
    if (token.k === 'op' && token.v === '(') { const inner = or(); take(')'); return inner; }
    if (token.k === 'id') {
      const name = token.v as string;
      if (peek()?.k === 'op' && peek()!.v === '(') {
        take('(');
        const args: Node[] = [];
        if (!(peek()?.k === 'op' && peek()!.v === ')')) {
          args.push(or());
          while (peek()?.k === 'op' && peek()!.v === ',') { take(); args.push(or()); }
        }
        take(')');
        return { t: 'call', name: name.toLowerCase(), args };
      }
      return { t: 'id', name };
    }
    throw new ExpressionError(`unexpected "${token.v}" in "${source}"`);
  };
  const postfix = (): Node => {
    let a = primary();
    while (isOp('!')) { take(); a = { t: 'fact', a }; }
    return a;
  };
  const unary = (): Node => {
    if (isOp('-', '+')) { const op = take().v as string; return { t: 'un', op, a: unary() }; }
    if (isWord('not')) { take(); return { t: 'un', op: 'not', a: unary() }; }
    return postfix();
  };
  const power = (): Node => {
    const a = unary();
    if (isOp('^')) { take(); return { t: 'bin', op: '^', a, b: power() }; }
    return a;
  };
  const product = binary(power, ['*', '/', '\\', '%'], ['mod'], { mod: '%' });
  const sum = binary(product, ['+', '-']);
  const relation = binary(sum, ['<', '<=', '>', '>=']);
  const equality = binary(relation, ['=', '<>']);
  const and = binary(equality, ['&'], ['and'], { and: '&' });
  const or: () => Node = binary(and, ['|'], ['or', 'xor'], { or: '|' });
  const node = or();
  if (p !== tokens.length) throw new ExpressionError(`unexpected "${tokens[p].v}" in "${source}"`);
  cache.set(source, node);
  return node;
}

function tokenize(source: string): Array<{ k: 'num' | 'str' | 'id' | 'op'; v: number | string }> {
  const out: Array<{ k: 'num' | 'str' | 'id' | 'op'; v: number | string }> = [];
  let i = 0;
  while (i < source.length) {
    const c = source[i];
    if (/\s/.test(c)) { i++; continue; }
    const number = /^(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/.exec(source.slice(i));
    if (number) { out.push({ k: 'num', v: Number(number[0]) }); i += number[0].length; continue; }
    const word = /^[A-Za-z_][A-Za-z0-9_]*/.exec(source.slice(i));
    if (word) { out.push({ k: 'id', v: word[0] }); i += word[0].length; continue; }
    if (c === '"') {
      const end = source.indexOf('"', i + 1);
      if (end < 0) throw new ExpressionError(`unterminated string in "${source}"`);
      out.push({ k: 'str', v: source.slice(i + 1, end) }); i = end + 1; continue;
    }
    const two = source.slice(i, i + 2);
    if (['<=', '>=', '<>'].includes(two)) { out.push({ k: 'op', v: two }); i += 2; continue; }
    if ('+-*/\\%^!()<>=&|,'.includes(c)) { out.push({ k: 'op', v: c }); i++; continue; }
    throw new ExpressionError(`unexpected character "${c}" in "${source}"`);
  }
  return out;
}

const num = (v: Value): number => {
  if (typeof v === 'number') return v;
  const parsed = Number(v);
  if (v.trim() === '' || Number.isNaN(parsed)) throw new ExpressionError(`string "${v}" used as a number`);
  return parsed;
};

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new ExpressionError('factorial of non-integer');
  let r = 1;
  for (let k = 2; k <= n; k++) r *= k;
  return r;
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a;
}

const FUNCTIONS: Record<string, (args: Value[]) => Value> = {
  sin: ([a]) => Math.sin(num(a)), cos: ([a]) => Math.cos(num(a)), tan: ([a]) => Math.tan(num(a)),
  sec: ([a]) => 1 / Math.cos(num(a)), csc: ([a]) => 1 / Math.sin(num(a)), cot: ([a]) => 1 / Math.tan(num(a)),
  asin: ([a]) => Math.asin(num(a)), acos: ([a]) => Math.acos(num(a)), atan: ([a]) => Math.atan(num(a)),
  sqrt: ([a]) => Math.sqrt(num(a)), abs: ([a]) => Math.abs(num(a)), exp: ([a]) => Math.exp(num(a)),
  ln: ([a]) => Math.log(num(a)), log: ([a]) => Math.log10(num(a)), log10: ([a]) => Math.log10(num(a)),
  floor: ([a]) => Math.floor(num(a)), ceil: ([a]) => Math.ceil(num(a)), int: ([a]) => Math.trunc(num(a)),
  frac: ([a]) => num(a) - Math.trunc(num(a)), sgn: ([a]) => Math.sign(num(a)),
  round: ([a, d]) => { const f = 10 ** (d === undefined ? 0 : num(d)); return Math.round(num(a) * f) / f; },
  min: (args) => Math.min(...args.map(num)), max: (args) => Math.max(...args.map(num)),
  pow: ([a, b]) => num(a) ** num(b), mod: ([a, b]) => num(a) % num(b),
  gcf: (args) => args.map(num).reduce(gcd), lcm: (args) => args.map(num).reduce((a, b) => Math.abs(a * b) / gcd(a, b)),
  str: ([a]) => (typeof a === 'string' ? a : formatNumber(a)), chr: ([a]) => String.fromCharCode(num(a)),
};

/** Registers semantics that are confirmed later (e.g. sqr); unknown functions throw. */
export function setFunction(name: string, fn: (args: Value[]) => Value): void { FUNCTIONS[name] = fn; }

export function formatNumber(v: number): string {
  if (Number.isInteger(v)) return String(v);
  return String(Number(v.toPrecision(12)));
}

export function evaluate(node: Node | string, scope: Scope): Value {
  if (typeof node === 'string') node = parseExpression(node);
  switch (node.t) {
    case 'num': return node.v;
    case 'str': return node.v;
    case 'id': {
      const value = scope.lookup(node.name);
      if (value !== undefined) return value;
      const lower = node.name.toLowerCase();
      if (lower === 'pi') return Math.PI;
      if (lower === 'inf') return Infinity;
      if (lower === 'true') return 1;
      if (lower === 'false') return 0;
      throw new ExpressionError(`unknown variable ${node.name}`);
    }
    case 'call': {
      const fn = FUNCTIONS[node.name];
      if (!fn) throw new ExpressionError(`unsupported function ${node.name}()`);
      return fn(node.args.map((arg) => evaluate(arg, scope)));
    }
    case 'un': {
      const a = evaluate(node.a, scope);
      if (node.op === 'not') return num(a) ? 0 : 1;
      return node.op === '-' ? -num(a) : num(a);
    }
    case 'fact': return factorial(num(evaluate(node.a, scope)));
    case 'bin': {
      const a = evaluate(node.a, scope), b = evaluate(node.b, scope);
      switch (node.op) {
        case '+': return typeof a === 'string' || typeof b === 'string' ? `${a}${b}` : a + b;
        case '-': return num(a) - num(b);
        case '*': return num(a) * num(b);
        case '/': return num(a) / num(b);
        case '\\': return Math.trunc(num(a) / num(b));
        case '%': return num(a) % num(b);
        case '^': return num(a) ** num(b);
        case '<': return +(num(a) < num(b));
        case '<=': return +(num(a) <= num(b));
        case '>': return +(num(a) > num(b));
        case '>=': return +(num(a) >= num(b));
        case '=': return +(typeof a === 'string' || typeof b === 'string' ? String(a) === String(b) : num(a) === num(b));
        case '<>': return +(typeof a === 'string' || typeof b === 'string' ? String(a) !== String(b) : num(a) !== num(b));
        case '&': return +(!!num(a) && !!num(b));
        case '|': return +(!!num(a) || !!num(b));
        case 'xor': return +(!!num(a) !== !!num(b));
      }
    }
  }
  throw new ExpressionError('invalid expression node');
}

/** Numeric value or undefined when ExamView would treat the point as undefined (error, NaN, ±∞). */
export function evaluateNumber(source: string | Node, scope: Scope): number {
  const value = evaluate(source, scope);
  return num(value);
}
