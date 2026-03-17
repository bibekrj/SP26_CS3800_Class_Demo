/**
 * error.test.js
 *
 * Tests for the error handling middleware (middleware/error.js)
 * The middleware takes (err, req, res, next) and always sends back
 * a 500 status with a JSON error body
 *
 * Same fake req/res pattern as the controller tests
 *
 * run by: npx jest error.test.js
 */

import { jest, describe, test, expect, beforeEach } from "@jest/globals";

// dynamically import the middleware
const { default: errorHandler } = await import("../middleware/error.js");

// builds a fake res object just like in the controller tests
function makeRes() {
  const res = {
    // status() returns res so we can chain res.status(500).json(...)
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("errorHandler middleware", () => {
  test("always responds with status 500", () => {
    const err = new Error("Something broke");
    const req = {};
    const res = makeRes();
    // next is required in the signature but errorHandler never calls it
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("responds with JSON error body", () => {
    const err = new Error("Something broke");
    const req = {};
    const res = makeRes();
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  test("does not call next() since it handles the response itself", () => {
    const err = new Error("Something broke");
    const req = {};
    const res = makeRes();
    const next = jest.fn();

    errorHandler(err, req, res, next);

    // middleware that ends the request should never call next
    expect(next).not.toHaveBeenCalled();
  });

  test("still responds correctly even if err has no message", () => {
    // passing an empty error object to make sure it doesnt crash
    const err = {};
    const req = {};
    const res = makeRes();
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});