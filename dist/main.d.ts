declare type StorageType = "memory" | "session" | "idb" | "local";
declare abstract class CachedTaskStore {
    private memType;
    constructor(memType: StorageType);
}
declare class inMemoryStore extends CachedTaskStore {
    constructor();
}
export declare namespace CachedTaskStoreTypes {
    const inMemory: inMemoryStore;
}
declare type CachedTaskManagerInitOptions = {
    storage: CachedTaskStore;
};
/**Cached Task Manager.
 * Provides caching promise result.
 */
declare class CachedTaskManager {
    private option;
    private taskTable;
    /**Make new instance of Cached task manager. */
    constructor(option?: CachedTaskManagerInitOptions);
    withTask<T>(id: string, resolver: () => Promise<T>): Promise<T>;
    private openTask;
}
export default CachedTaskManager;
