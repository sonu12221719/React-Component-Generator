// /services/ast.js
import * as parser from '@babel/parser';
import traverseModule from '@babel/traverse';
const traverse = traverseModule.default || traverseModule;  // FIX
import { safeParse } from './debug/parser.js';

import * as t from '@babel/types';
import generateModule from '@babel/generator';
const generate = generateModule.default || generateModule;  // FIX

import { v4 as uuid } from 'uuid';

export function injectNodeIds(code) {
//   const ast = parser.parse(code, {
//     sourceType: 'module',
//     plugins: ['jsx'],
//   });
    const ast = safeParse(code);

  const nodes = [];

  traverse(ast, {
    JSXElement(path) {
      const opening = path.node.openingElement;
      const id = uuid();
      opening.attributes.push(
        t.jsxAttribute(t.jsxIdentifier('data-node-id'), t.stringLiteral(id))
      );
  
      nodes.push({
        nodeId: id,
        start: path.node.start,   // now the WHOLE JSX element range
        end: path.node.end,
        type: path.node.type,
      });
    },
  });

  const output = generate(ast, { retainLines: true }, code);
  return { code: output.code, nodes };
}
