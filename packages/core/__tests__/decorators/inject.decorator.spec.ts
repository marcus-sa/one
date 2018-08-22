import { forwardRef, Inject, Injectable } from '@one/core';
import { TestBed } from '@one/testing';

describe('@Inject()', () => {
  /*it('should create circular dependencies', async () => {
    @Injectable()
    class Test1 {
      @Inject(Test2)
      public readonly test2: Test2;
    }

    @Injectable()
    class Test2 {
      @Inject(Test1)
      public readonly test1: Test1;
    }

    const module = await TestBed.createProviders([
      Test1,
      Test2,
    ]);
  });*/

  it('should solve circular dependencies using forwardRef', async () => {
    @Injectable()
    class Test1 {
      @Inject(forwardRef(() => Test2))
      public readonly test2: Test2;
    }

    @Injectable()
    class Test2 {
      @Inject(forwardRef(() => Test1))
      public readonly test1: Test1;
    }

    const providers = await TestBed.createProviders([
      Test1,
      Test2,
    ]);

    expect(providers.get<Test2>(Test2).test1).toBeInstanceOf(Test1);
    expect(providers.get<Test1>(Test1).test2).toBeInstanceOf(Test2);
  });

});
