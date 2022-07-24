import "fake-indexeddb/auto";
import TaskManager, { CachedTaskStoreTypes } from "../dist/main";

test("instance with memory option", () => {
  const manager = new TaskManager({ storage: CachedTaskStoreTypes.inMemory });
  expect(manager).toBeInstanceOf(TaskManager);
});
