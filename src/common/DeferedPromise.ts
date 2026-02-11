import { IDeferedPromise } from "../interfaces/IDeferedPromise";

export class DeferredPromise<T> implements IDeferedPromise<T> {
  promise: Promise<T>;
  resolve!: (value: T | PromiseLike<T>) => void;
  reject!: (reason?: unknown) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}