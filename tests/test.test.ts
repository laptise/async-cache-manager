import TaskManager from "../dist/main";
import { returnThisWithTimeOut, throwThisWithTimeOut } from "./testTools";

test("Module loaded", () => {
  expect(TaskManager).toBeTruthy();
});

test("Instance OK", () => {
  expect(new TaskManager()).toBeTruthy();
});

test("2 results are same", async () => {
  const manager = new TaskManager();
  const [result1, result2] = await new Promise<number[]>(async (testResolve, testReject) => {
    const _500res = manager.withTask("test", () => returnThisWithTimeOut(7371, 120));
    const _750res = manager.withTask("test", () => returnThisWithTimeOut(1193, 300));
    const res = await Promise.all([_500res, _750res]);
    testResolve(res);
  });
  expect(result1).toEqual(result2);
});

test("All reqs should rejected", async () => {
  const manager = new TaskManager();
  const _100res = manager.withTask("test", () => throwThisWithTimeOut(7371, 100));
  const _200res = manager.withTask("test", () => returnThisWithTimeOut(1193, 200));
  const _300res = manager.withTask("test", () => returnThisWithTimeOut(1193, 300));
  const res = await Promise.allSettled([_100res, _200res, _300res]);
  const everythingRejected = res.every((x) => x.status === "rejected");
  expect(everythingRejected).toBeTruthy();
});

test("Reuse result from resolved promise", async () => {
  const manager = new TaskManager();
  const ANSWER = Math.random();
  const _100res = manager.withTask("test", () => returnThisWithTimeOut(ANSWER, 100));
  const _200res = manager.withTask("test", () => returnThisWithTimeOut(Math.random(), 200));
  const _300res = manager.withTask("test", () => returnThisWithTimeOut(Math.random(), 300));
  const _400res = manager.withTask("test", () => returnThisWithTimeOut(Math.random(), 400));
  const res = await Promise.all([_100res, _200res, _300res, _400res]);
  const everyAnswersAreCorrect = res.every((x) => x === ANSWER);
  expect(everyAnswersAreCorrect).toBeTruthy();
});
