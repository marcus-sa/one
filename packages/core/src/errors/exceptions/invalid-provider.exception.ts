import { RuntimeException } from './runtime.exception';

export class InvalidProviderException extends RuntimeException {
  constructor(provider: any) {
    const s = new Symbol();
    super(
      `${provider.name ||
        provider.toString()} is invalid. Must be an InjectionToken or Injectable`,
    );
  }
}
