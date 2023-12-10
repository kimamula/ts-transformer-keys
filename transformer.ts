import ts from 'typescript';
import path from 'path';

const createArrayExpression = ts.factory?.createArrayLiteralExpression ?? ts.createArrayLiteral;
const createStringLiteral = ts.factory?.createStringLiteral ?? ts.createLiteral;

export default function transformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
  return context => {
    return file => {
      const visitNode = (node: ts.Node): ts.Node | undefined => {
        const typeChecker = program.getTypeChecker();

        if (isKeysImportExpression(node)) {
          return undefined;
        }

        if (!isKeysCallExpression(node, typeChecker)) {
          return ts.visitEachChild(node, visitNode, context);
        }

        if (!node.typeArguments) {
          return createArrayExpression([]);
        }

        const type = typeChecker.getTypeFromTypeNode(node.typeArguments[0]);
        const properties = typeChecker.getPropertiesOfType(type);

        return createArrayExpression(properties.map(property => createStringLiteral(property.name)));
      };

      return ts.visitEachChild(file, visitNode, context);
    };
  };
}

const indexJs = path.join(__dirname, 'index.js');
function isKeysImportExpression(node: ts.Node): node is ts.ImportDeclaration {
  if (!ts.isImportDeclaration(node)) {
    return false;
  }

  const module = (node.moduleSpecifier as ts.StringLiteral).text;
  try {
    return indexJs === (
      module.startsWith('.')
        ? require.resolve(path.resolve(path.dirname(node.getSourceFile().fileName), module))
        : require.resolve(module)
    );
  } catch {
    return false;
  }
}

const indexTs = path.join(__dirname, 'index.d.ts');
function isKeysCallExpression(node: ts.Node, typeChecker: ts.TypeChecker): node is ts.CallExpression {
  if (!ts.isCallExpression(node)) {
    return false;
  }

  const declaration = typeChecker.getResolvedSignature(node)?.declaration;
  if (!declaration || ts.isJSDocSignature(declaration) || declaration.name?.getText() !== 'keys') {
    return false;
  }

  try {
    return require.resolve(declaration.getSourceFile().fileName) === indexTs;
  } catch {
    return false;
  }
}
