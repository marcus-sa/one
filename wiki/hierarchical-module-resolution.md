## Hierarchical module resolution
When importing or exporting modules / providers, children will always be resolved first.

Tree: `SecondModule -> FirstModule -> AppModule`

```ts
@Module()
class SecondModule {}

@Module({
    imports: [SecondModule],
})
class FirstModule {}

@Module({
    imports: [FirstModule],
})
class AppModule {}
```