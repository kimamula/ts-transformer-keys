import ts from 'typescript';
import transformer from '../../transformer';

function getDefaultModuleResolution(): ts.ModuleResolutionKind {
  if('NodeJs' in ts.ModuleResolutionKind) {
    return ts.ModuleResolutionKind.NodeJs;
  }

  if('Node10' in ts.ModuleResolutionKind) {
    // @ts-ignore forward compatibility check
    return ts.ModuleResolutionKind.Node10 as ts.ModuleResolutionKind;
  }

  throw new Error('Cannot choose default module resolution kind')
}

export function compile(filePaths: string[], target = ts.ScriptTarget.ES5, writeFileCallback?: ts.WriteFileCallback) {
  const program = ts.createProgram(filePaths, {
    strict: true,
    noEmitOnError: true,
    noUncheckedIndexedAccess: false,
    esModuleInterop: true,
    moduleResolution: getDefaultModuleResolution(),
    target
  });
  const transformers: ts.CustomTransformers = {
    before: [transformer(program)],
    after: []
  };
  const { emitSkipped, diagnostics } = program.emit(undefined, writeFileCallback, undefined, false, transformers);

  if (emitSkipped) {
    throw new Error(diagnostics.map(diagnostic => diagnostic.messageText).join('\n'));
  }
}
