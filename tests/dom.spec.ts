import "fake-indexeddb/auto";
import AsyncCacheManager, { AsyncCacheStoreTypes } from "../dist/main";

test("instance with memory option", () => {
  const manager = new AsyncCacheManager({ storage: AsyncCacheStoreTypes.inMemory });
  expect(manager).toBeInstanceOf(AsyncCacheManager);
});
