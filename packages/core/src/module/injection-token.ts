export class InjectionToken<T> {
  private readonly name = Symbol.for(`InjectionToken<${this.desc}>`);

  constructor(private readonly desc: string) {}

  public get() {
    return this.name;
  }
}
