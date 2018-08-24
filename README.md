# One
![GitHub](https://img.shields.io/github/license/marcus-sa/one.svg)
## Description
DI architecture using TypeScript

## Roadmap
### Done
☑️ [Hierarchical module resolution `SecondModule -> FirstModule -> AppModule`](https://github.com/marcus-sa/one/blob/master/wiki/hierarchical-module-resolution.md)
<br />
☑️ [`MODULE_INITIALIZER` and `APP_INITIALIZER` providers](https://github.com/marcus-sa/one/blob/master/wiki/built-in-providers.md)
<br />
☑️ [Lazy injection using `forwardRef`](https://github.com/marcus-sa/one/blob/master/examples/circular/src/first.service.ts)
<br />
☑️ [Async module imports](https://github.com/marcus-sa/one/blob/master/packages/electron/src/electron.module.ts)
### Missing
❎ [Add support for async `FactoryProvider` bindings](https://github.com/marcus-sa/one/issues/6)
<br />
❎ Wait to resolve `Provider` dependencies until it's being injected
<br />
❎ Documentation
<br />
❎ Unit testing
<br />
❎ Release
