export class GlobalStore {
  // should not be used for rendering 
  private static instance: GlobalStore;
  private _store = new Map<string, unknown>();

  static getInstance() {
    if (!GlobalStore.instance) {
      GlobalStore.instance = new GlobalStore();
    }
    return GlobalStore.instance;
  }

  save(key: string, value: unknown) {
    this._store.set(key, value)
  }

  get(key: string) {
    return this._store.get(key);
  }
}