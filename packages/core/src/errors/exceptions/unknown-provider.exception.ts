import { RuntimeException } from './runtime.exception';
import { Registry } from '../../registry';

export class UnknownProviderException extends RuntimeException {
  constructor(provider: any) {
    const name = Registry.getProviderName(provider);
    super(`${name} could not be found`);
  }
}
