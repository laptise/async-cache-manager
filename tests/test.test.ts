import FetchManager from "../dist/main";

test("module loaded", () => {
  expect(FetchManager).toBeTruthy();
});

test("instance OK", () => {
  expect(new FetchManager()).toBeTruthy();
});
