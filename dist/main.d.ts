declare class CachedTaskManager {
    private taskTable;
    constructor();
    withTask<T>(id: string, resolver: () => Promise<T>): Promise<T>;
    private openTask;
}
export default CachedTaskManager;
