import 'reflect-metadata';
import { TransientScope, SCOPES, SCOPE } from '@one/core';

describe('@TransientScope()', () => {
  it('should define metadata scope as transient', () => {
    @TransientScope()
    class Test {}

    const scope = Reflect.getMetadata(SCOPE, Test);
    expect(scope).toStrictEqual(SCOPES.TRANSIENT);
  });
});
