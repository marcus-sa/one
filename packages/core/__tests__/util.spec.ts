import { DeferredPromise, Utils } from '@one/core';
import { MissingRequiredDependencyMessage } from '@one/core/errors/messages';

describe('Utils', () => {
  let isFunctionSpy: jest.SpyInstance;
  let isObjectSpy: jest.SpyInstance;
  let isNilSpy: jest.SpyInstance;

  beforeEach(() => {
    isFunctionSpy = jest.spyOn(Utils, 'isFunction');
    isObjectSpy = jest.spyOn(Utils, 'isObject');
    isNilSpy = jest.spyOn(Utils, 'isNil');
  });

  afterEach(() => {
    isFunctionSpy.mockClear();
    isObjectSpy.mockClear();
    isNilSpy.mockClear();
  });

  describe('createDeferredPromise', () => {
    let deferred: DeferredPromise;

    beforeEach(() => {
      deferred = Utils.createDeferredPromise();
    });

    it('should create', () => {
      expect(deferred).toBeInstanceOf(Promise);

      expect(deferred.then).toBeFunction();
      expect(deferred.catch).toBeFunction();

      expect(deferred.resolve).toBeFunction();
      expect(deferred.reject).toBeFunction();
    });

    it('should resolve', () => {
      const thenSpy = jest.spyOn(deferred, 'then');

      deferred.then(() => {});
      deferred.resolve();

      expect(thenSpy).toHaveBeenCalledTimes(1);
    });

    it('should reject', () => {
      const catchSpy = jest.spyOn(deferred, 'catch');

      deferred.catch(() => {});
      deferred.reject();

      expect(catchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadPackage', () => {
    jest.mock('express', () => {});
    afterAll(() => jest.restoreAllMocks());

    it(`should throw MissingRequiredDependencyException if package doesn't exist`, async () => {
      const name = '@nestjs/core';

      const message = MissingRequiredDependencyMessage(name, '');

      await expect(Utils.loadPackage(name, '')).rejects.toThrow(message);
    });

    it('should load package if it exists', async () => {
      const express = require('express');

      await expect(Utils.loadPackage('express', '')).resolves.toStrictEqual(
        express,
      );
    });
  });

  describe('isNamedFunction', () => {
    it('should be true with a named function', () => {
      function nest() {}

      expect(Utils.isNamedFunction(nest)).toBeTrue();
      // expect(isNilSpy).toHaveBeenCalledWith(nest.name);
      expect(isFunctionSpy).toHaveBeenCalledWith(nest);
    });

    it('should be false with an anonymous function', () => {
      // This doesn't work, weird enough
      // const nest = () => {};

      expect(Utils.isNamedFunction(() => {})).toBeFalse();
      expect(isFunctionSpy).not.toHaveBeenCalled();
      // expect(isFunctionSpy).toHaveBeenCalledWith(() => {});
    });

    it('should be true with a class', () => {
      class Nest {}

      expect(Utils.isNamedFunction(Nest)).toBeTrue();
      // expect(isNilSpy).toHaveBeenCalledWith(Nest.name);
      expect(isFunctionSpy).toHaveBeenCalledWith(Nest);
    });
  });
});
