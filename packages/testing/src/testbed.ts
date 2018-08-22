import { ModuleMetadata, Provider, bootstrap, Module } from '@one/core';

export class TestBed {

  public static async create(module: ModuleMetadata) {
    @Module(module)
    class AppModule {}

    return await bootstrap(AppModule);
  }

  public static async createProviders(providers: Provider[]) {
    return (await TestBed.create({ providers })).providers;
  }

}
