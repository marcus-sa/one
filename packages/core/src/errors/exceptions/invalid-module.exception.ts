import { InvalidModuleMessage } from '../messages';

export class InvalidModuleException extends Error {
  constructor(trace: any[] = []) {
    const scope = trace.map(module => module.name).join(' -> ');
    super(InvalidModuleMessage(scope));
  }
}
