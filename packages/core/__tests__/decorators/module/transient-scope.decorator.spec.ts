import 'reflect-metadata';
import { TransientScope, SCOPES, SCOPE_METADATA } from '@one/core';

describe('@TransientScope()', () => {
  it('should define metadata scope as transient', () => {
    @TransientScope()
    class Test {}

    const scope = Reflect.getMetadata(SCOPE_METADATA, Test);
    expect(scope).toEqual(SCOPES.TRANSIENT);
  });
});
