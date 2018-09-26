import 'reflect-metadata';
import { CircularDependencyMessage, forwardRef, Inject, Injectable } from '@nest/core';
import { Testing } from '@nest/testing';

describe('@Inject()', () => {
  it('should create circular dependencies', async () => {
    const message = CircularDependencyMessage('Test1');

    expect(() => {
      @Injectable()
      class Test1 {
        @Inject(Test2)
        public readonly test2!: Test2;
      }

      @Injectable()
      class Test2 {
        @Inject(Test1)
        public readonly test1!: Test1;
      }
    }).toThrow(message);
  });

  it('should solve circular dependencies using forwardRef', async () => {
    @Injectable()
    class Test1 {
      @Inject(forwardRef(() => Test2))
      public readonly test2!: Test2;
    }

    @Injectable()
    class Test2 {
      @Inject(forwardRef(() => Test1))
      public readonly test1!: Test1;
    }

    const fixture = await Testing.create({
      providers: [
        Test1,
        Test2,
      ],
    }).compile();

    expect(fixture.get<Test2>(Test2).test1).toBeInstanceOf(Test1);
    expect(fixture.get<Test1>(Test1).test2).toBeInstanceOf(Test2);
  });

});
