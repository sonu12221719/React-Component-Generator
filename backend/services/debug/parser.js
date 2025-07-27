import * as parser from '@babel/parser';
import { codeFrameColumns } from '@babel/code-frame'; // This comes from Babel, already installed with @babel/parser

export function safeParse(code, opts = {}) {
  try {
    return parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
      ...opts,
    });
  } catch (e) {
    const loc = { start: { line: e.loc.line, column: e.loc.column + 1 } };
    const frame = codeFrameColumns(code, loc, { highlightCode: true });
    const message = `${e.message}\n${frame}`;
    const error = new Error(message);
    error.original = e;
    throw error;
  }
}
