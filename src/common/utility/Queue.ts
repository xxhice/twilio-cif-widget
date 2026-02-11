export class Queue<T> {
  private _queue: T[];

  constructor() {
    this._queue = [];
  }

  next(): T | undefined {
    return this._queue[0];
  }

  enqueue(func: T): void {
    this._queue.push(func);
  }

  dequeue(): T | undefined {
    return this._queue.shift();
  }

  contains(func: T): boolean {
    return this._queue.includes(func);
  }

  isEmpty(): boolean {
    return this._queue.length === 0;
  }

  clearQueue(): void {
    this._queue = [];
  }
}
