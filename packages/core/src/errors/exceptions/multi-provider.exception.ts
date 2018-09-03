import { Registry } from '../../registry';
import { Provider } from '../../interfaces';

export class MultiProviderException extends Error {
  constructor(provider: Provider) {
    const name = Registry.getProviderName(provider);
    super(
      `Provider ${name} is already bound. Set the multi property to true, to allow multiple providers being bound to this token`,
    );
  }
}
