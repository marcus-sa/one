import { RuntimeException } from './runtime.exception';
import { Registry } from '../../registry';
import { Token } from '../../interfaces';

export class UnknownProviderException extends RuntimeException {
  constructor(provider: Token) {
    const name = Registry.getProviderName(provider);
    super(`${name} could not be found`);
  }
}
