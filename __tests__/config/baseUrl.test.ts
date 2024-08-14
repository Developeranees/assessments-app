import { API_BASE_URL } from "config/baseUrl";

describe("API_BASE_URL", () => {
  it("should be defined", () => {
    expect(API_BASE_URL).toBeDefined();
  });

  it("should be not empty", () => {
    expect(API_BASE_URL).not.toBe("");
  });
});
