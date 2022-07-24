function deepCopy<T>(obj: any) {
  return JSON.parse(JSON.stringify(obj)) as T;
}

type StorageType = "memory" | "session" | "idb" | "local";
abstract class CachedTaskStore {
  constructor(private memType: StorageType) {}
}

class inMemoryStore extends CachedTaskStore {
  constructor() {
    super("memory");
  }
}
class inSessionStore extends CachedTaskStore {
  constructor() {
    super("session");
  }
}
class inIndexedDbStore extends CachedTaskStore {
  constructor(private expires: number) {
    super("idb");
  }
}

export namespace CachedTaskStoreTypes {
  export const inMemory = new inMemoryStore();
  // export const inSession = new inSessionStore();
  // export const inIndexedDb_expiresIn = (expires: number) => new inIndexedDbStore(expires);
}

type CachedTaskManagerInitOptions = {
  storage: CachedTaskStore;
};

class AlreadyOpenedTaskException<T> {
  constructor(public child: ChildCachedTask<T>) {}
}

class ExceptionOnTask<T> {
  constructor(public e: T) {}
}

/**Cached Task Manager.
 * Provides caching promise result.
 */
class CachedTaskManager {
  private taskTable: { [key: string]: CachedTaskSet<any> } = {};
  /**Make new instance of Cached task manager. */
  constructor(private option: CachedTaskManagerInitOptions = { storage: CachedTaskStoreTypes.inMemory }) {
    if (option.storage instanceof inMemoryStore) {
    } else if (option.storage instanceof inIndexedDbStore) {
      if (typeof indexedDB === "undefined") throw "no idb";
    }
  }
  public async withTask<T>(id: string, resolver: () => Promise<T>) {
    const res = await this.openTask<T>(id)
      .then((task) =>
        resolver()
          .catch((e) => new ExceptionOnTask(e))
          .then((res) => task.close(res))
      )
      .catch((y: AlreadyOpenedTaskException<T>) => {
        if (y instanceof AlreadyOpenedTaskException) {
          return y.child.waitForResolve<T>();
        } else throw y;
      });
    return res;
  }

  private async openTask<T>(id: string) {
    const existingTask = this.taskTable[id];
    if (existingTask == undefined) {
      this.taskTable[id] = new CachedTaskSet(id);
      const newParent = new ParentCachedTask<T>(id, this.taskTable[id]);
      this.taskTable[id].parent = newParent;
      newParent.list = this.taskTable[id];
      return newParent;
    } else {
      const newChild = new ChildCachedTask<T>(id, this.taskTable[id]);
      existingTask.addTask(newChild);
      throw new AlreadyOpenedTaskException(newChild);
    }
  }
}

class CachedTaskSet<T> {
  public isResolved: boolean;
  public isRejected: boolean;
  public parent!: ParentCachedTask<T>;
  private _result!: T;
  private _reject!: ExceptionOnTask<T>;
  private children: ChildCachedTask<T>[] = [];
  constructor(public id: string) {
    this.isResolved = false;
    this.isRejected = false;
  }
  public get result() {
    return this._result;
  }
  public set result(v) {
    this._result = v;
    this.isResolved = true;
    this.children.map((x) => x.taskResolver(v));
  }
  public get reject() {
    return this._reject;
  }
  public set reject(v) {
    this._reject = v;
    this.isRejected = true;
    this.children.map((x) => x.taskRejector(v));
  }

  public addTask(child: ChildCachedTask<T>) {
    this.children.push(child);
  }
}

class CachedTask<T> {
  constructor(public id: string, public list: CachedTaskSet<T>) {}
}

class ParentCachedTask<T> extends CachedTask<T> {
  private result!: T;
  private reject!: ExceptionOnTask<T>;
  public async close(resOrErr: T | ExceptionOnTask<T>): Promise<T> {
    try {
      if (resOrErr instanceof ExceptionOnTask) {
        throw resOrErr;
      } else {
        this.result = deepCopy(resOrErr);
        setTimeout(() => (this.list.result = deepCopy(resOrErr)), 0);
        return this.result;
      }
    } catch (e) {
      if (e instanceof ExceptionOnTask) {
        this.reject = deepCopy(e);
        setTimeout(() => (this.list.reject = deepCopy(e)), 0);
        throw this.reject;
      } else {
        throw e;
      }
    }
  }
}

class ChildCachedTask<T> extends CachedTask<T> {
  private resultPromise: Promise<T>;
  public async waitForResolve<T>() {
    if (this.list.isRejected) {
      this.taskRejector(this.list.reject);
    } else if (this.list.isResolved) {
      this.taskResolver(this.list.result);
    }
    const res = await this.resultPromise;
    if (res instanceof ExceptionOnTask) {
      throw res;
    } else return deepCopy<T>(res);
  }
  public taskResolver!: (res: T) => void;
  public taskRejector!: (res: ExceptionOnTask<T>) => void;
  constructor(public id: string, public list: CachedTaskSet<T>) {
    super(id, list);
    this.resultPromise = new Promise<T>((res, rej) => {
      this.taskResolver = res;
      this.taskRejector = rej;
    });
  }
}

export default CachedTaskManager;
