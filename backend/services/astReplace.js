// backend/services/astReplace.js
import generateModule from '@babel/generator';
import * as parser from '@babel/parser';
import traverseModule from '@babel/traverse';
import * as t from '@babel/types';
const traverse = traverseModule.default || traverseModule;
const generate = generateModule.default || generateModule;

export function extractJSXByNodeId(source, nodeId) {
  const ast = parser.parse(source, { sourceType: 'module', plugins: ['jsx'] });
  let code = '';
  let loc = null;

  traverse(ast, {
    JSXOpeningElement(path) {
      const attr = path.node.attributes.find(
        (a) =>
          t.isJSXAttribute(a) &&
          t.isJSXIdentifier(a.name, { name: 'data-node-id' }) &&
          a.value &&
          t.isStringLiteral(a.value) &&
          a.value.value === nodeId
      );
      if (!attr) return;

      const jsxElPath = path.parentPath; // JSXElement
      code = generate(jsxElPath.node).code;
      loc = { start: jsxElPath.node.start, end: jsxElPath.node.end };
      path.stop();
    },
  });

  if (!code) throw new Error(`Node with id "${nodeId}" not found`);
  return { code, loc };
}

export function replaceJSXByNodeId(source, nodeId, newJSXSource) {
  const ast = parser.parse(source, { sourceType: 'module', plugins: ['jsx'] });
  let replaced = false;

  // parse as expression (JSXElement/Fragment)
  const replExpr = parser.parseExpression(newJSXSource, { plugins: ['jsx'] });
  if (!t.isJSXElement(replExpr) && !t.isJSXFragment(replExpr)) {
    throw new Error('Patched snippet is not a JSX element or fragment');
  }

  traverse(ast, {
    JSXOpeningElement(path) {
      const attr = path.node.attributes.find(
        (a) =>
          t.isJSXAttribute(a) &&
          t.isJSXIdentifier(a.name, { name: 'data-node-id' }) &&
          a.value &&
          t.isStringLiteral(a.value) &&
          a.value.value === nodeId
      );
      if (!attr) return;

      path.parentPath.replaceWith(replExpr); // replace the whole JSXElement
      replaced = true;
      path.stop();
    },
  });

  if (!replaced) {
    throw new Error(`Node with id "${nodeId}" not found for replacement`);
  }

  return generate(ast, { retainLines: true }).code;
} 