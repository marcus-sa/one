import { Module, ModuleWithProviders } from '@one/core';

@Module()
export class StoreRootModule {}

@Module()
export class StoreFeatureModule {}

@Module()
export class StoreModule {
  static forRoot() {}

  static forFeature(): ModuleWithProviders {
    return {
      module: StoreFeatureModule,
      providers: [],
    };
  }
}
