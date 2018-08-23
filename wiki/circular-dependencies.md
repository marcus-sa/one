## Circular dependencies
### How to resolve circular dependencies in your providers

####  Known limitations:
* You can't lazy inject providers in the constructor

Import the following
```ts
import { Inject, forwardRef } from '@one/core';
```
<br />

Usage 1 using `forwardRef`:
```ts
// a.service.ts
@Injectable()
export class A {
    @Inject(forwardRef(() => B))
    private readonly b: B;
}

// b.service.ts
@Injectable()
export class B {
    @Inject(forwardRef(() => A))
    private readonly a: A;
}

// app.module.ts
@Module({
    providers: [A, B],
})
export class AppModule {}
```
<br />

Usage 2 when using `FactoryProvider`:
```ts
import { Injectable, Inject, forwardRef, Module } from '@one/core';

const LION_PROVIDER = Symbol.for('LION_PROVIDER');

@Injectable()
class A {
    @Inject(LION_PROVIDER)
    readonly lion: string;
}

@Module({
    providers: [
        A,
        {
            provide: LION_PROVIDER,
            useFactory: (a: A) => console.log(A),
            deps: [forwardRef(() => A)],
        }
    ],
})
class AppModule {}
```