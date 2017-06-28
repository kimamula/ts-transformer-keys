import * as ts from 'typescript';
import * as path from 'path';

export default function transformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext) => (file: ts.SourceFile) => visitNodeAndChildren(file, program, context);
}

function visitNodeAndChildren(node: ts.SourceFile, program: ts.Program, context: ts.TransformationContext): ts.SourceFile;
function visitNodeAndChildren(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node;
function visitNodeAndChildren(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node {
  return ts.visitEachChild(visitNode(node, program), childNode => visitNodeAndChildren(childNode, program, context), context);
}

function visitNode(node: ts.Node, program: ts.Program): ts.Node {
  const typeChecker = program.getTypeChecker();
  if (!isKeysCallExpression(node, typeChecker)) {
    return node;
  }
  if (!node.typeArguments) {
    return ts.createArrayLiteral([]);
  }
  const type = typeChecker.getTypeFromTypeNode(node.typeArguments[0]);
  const properties = typeChecker.getPropertiesOfType(type);
  return ts.createArrayLiteral(properties.map(property => ts.createLiteral(property.name)));
}

const indexTs = path.join(__dirname, 'index.ts');
function isKeysCallExpression(node: ts.Node, typeChecker: ts.TypeChecker): node is ts.CallExpression {
  if (node.kind !== ts.SyntaxKind.CallExpression) {
    return false;
  }
  const signature = typeChecker.getResolvedSignature(node as ts.CallExpression);
  if (typeof signature === 'undefined') {
    return false;
  }
  const { declaration } = signature;
  return !!declaration
    && (declaration.getSourceFile().fileName === indexTs)
    && !!declaration.name
    && (declaration.name.getText() === 'keys');
}
