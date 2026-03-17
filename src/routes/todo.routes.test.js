/**
 * todo.routes.test.js
 *
 * Integration tests for the todo routes using supertest.
 * Unlike the controller tests which use fake req/res objects, supertest
 * fires real HTTP requests against your express app so we can test the
 * full request/response cycle end to end
 *
 * We still mock the service layer so we never touch a real database
 *
 * install supertest first: npm install --save-dev supertest
 * run by: npx jest todo.routes.test.js
 */

import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import request from "supertest";

// mock the service so no real db calls happen
jest.unstable_mockModule("../services/todo.service.js", () => ({
  getTodosService: jest.fn(),
  createTodoService: jest.fn(),
  toggleTodoByIdService: jest.fn(),
  deleteTodoByIdService: jest.fn(),
}));

// dynamic imports after mock is set up
const { getTodosService, createTodoService, toggleTodoByIdService, deleteTodoByIdService } =
  await import("../services/todo.service.js");

// import the app after mocks are in place
const { default: app } = await import("../app.js");

beforeEach(() => {
  jest.clearAllMocks();
});

// GET /todos
describe("GET /todos", () => {
  test("status 200 and returns todos", async () => {
    const fakeTodos = [
      { id: 1, task: "Buy milk", completed: false },
      { id: 2, task: "Walk dog", completed: true },
    ];
    getTodosService.mockResolvedValue(fakeTodos);

    const res = await request(app).get("/todos");

    // basic status check
    expect(res.status).toBe(200);
  });

  test("response body has count and todos array", async () => {
    const fakeTodos = [{ id: 1, task: "Buy milk", completed: false }];
    getTodosService.mockResolvedValue(fakeTodos);

    const res = await request(app).get("/todos");

    // full body check
    expect(res.body).toEqual({ count: 1, todos: fakeTodos });
  });

  test("returns count 0 and empty array when no todos exist", async () => {
    getTodosService.mockResolvedValue([]);

    const res = await request(app).get("/todos");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ count: 0, todos: [] });
  });
});

// POST /todos
describe("POST /todos", () => {
  test("status 201 when todo is created", async () => {
    const newTodo = { id: 3, task: "Learn Jest", completed: false };
    createTodoService.mockResolvedValue(newTodo);

    const res = await request(app)
      .post("/todos")
      .send({ task: "Learn Jest" });

    expect(res.status).toBe(201);
  });

  test("response body has message and new todo", async () => {
    const newTodo = { id: 3, task: "Learn Jest", completed: false };
    createTodoService.mockResolvedValue(newTodo);

    const res = await request(app)
      .post("/todos")
      .send({ task: "Learn Jest" });

    expect(res.body).toEqual({ message: "Created", todo: newTodo });
  });

  test("status 400 when task is empty", async () => {
    createTodoService.mockRejectedValue(new Error("Invalid task"));

    const res = await request(app)
      .post("/todos")
      .send({ task: "" });

    expect(res.status).toBe(400);
  });

  test("status 400 when task is missing from body", async () => {
    createTodoService.mockRejectedValue(new Error("Invalid task"));

    const res = await request(app)
      .post("/todos")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid task" });
  });
});

// PATCH /todos/:id/toggle
describe("PATCH /todos/:id/toggle", () => {
  test("status 200 and returns toggled todo", async () => {
    const toggled = { id: 1, task: "Buy milk", completed: true };
    toggleTodoByIdService.mockReturnValue(toggled);

    const res = await request(app).patch("/todos/1/toggle");

    expect(res.status).toBe(200);
  });

  test("response body has message and toggled todo", async () => {
    const toggled = { id: 1, task: "Buy milk", completed: true };
    toggleTodoByIdService.mockReturnValue(toggled);

    const res = await request(app).patch("/todos/1/toggle");

    expect(res.body).toEqual({ message: "Toggled", todo: toggled });
  });

  test("status 400 when todo id does not exist", async () => {
    // service returns null to signal not found
    toggleTodoByIdService.mockReturnValue(null);

    const res = await request(app).patch("/todos/999/toggle");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Todo not found" });
  });
});

// DELETE /todos/delete/:id
describe("DELETE /todos/delete/:id", () => {
  test("status 200 and success message when deleted", async () => {
    const deleted = { id: 1, task: "Buy milk", completed: false };
    deleteTodoByIdService.mockReturnValue(deleted);

    const res = await request(app).delete("/todos/delete/1");

    expect(res.status).toBe(200);
  });

  test("response body has deleted successfully message", async () => {
    deleteTodoByIdService.mockReturnValue({ id: 1, task: "Buy milk", completed: false });

    const res = await request(app).delete("/todos/delete/1");

    expect(res.body).toEqual({ message: "Deleted Successfully" });
  });

  test("status 400 when todo id does not exist", async () => {
    // service returns null to signal not found
    deleteTodoByIdService.mockReturnValue(null);

    const res = await request(app).delete("/todos/delete/999");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Todo not found" });
  });
});