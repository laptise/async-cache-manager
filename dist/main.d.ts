declare class FetchManager {
    private fetchTable;
    constructor();
    withTask<T>(id: string, resolver: () => Promise<T>): Promise<unknown>;
    private openTask;
}
export default FetchManager;
