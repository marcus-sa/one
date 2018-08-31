export const InvalidModuleMessage = (scope: string) =>
  `Nest cannot create the module instance. Often, this is because of a circular dependency between modules. Use forwardRef() to avoid it. (Read more https://docs.nestjs.com/advanced/circular-dependency). Scope [${scope}]`;

export const UnknownExportMessage = (module: string, exported: string) =>
  `Nest cannot export a component/module (${exported}) that is not a part of the currently processed module (${module}). Please verify whether each exported unit is available in this particular context.`;

export const UNHANDLED_RUNTIME_EXCEPTION = 'Unhandled Runtime Exception.';
