/**
 * todo.service.test.js
 *
 * Tests for the SERVICE layer (todo.service.js).
 * The service layer holds your business logic — it calls the model (database),
 * but knows nothing about HTTP requests or responses.
 *
 * We use "mocking" here: instead of hitting a real database, we fake the
 * model functions so our tests are fast, isolated, and predictable.
 *
 * Run:  npx jest todo.service.test.js
 */

// ─── Imports ────────────────────────────────────────────────────────────────

// `jest.mock` replaces the real model module with a fake version.
// Every exported function becomes a "mock function" we can control.
jest.mock("../models/todo.models.js");

import { listTodos } from "./todo.controllers.js";

jest.mock("../models/todo.models.js", () => ({
  getAllTodos: jest.fn(() => Promise.resolve([{ id: 1, task: "Mocked task" }])),
}));

test("listTodos returns mocked tasks", async () => {
  const req = {};
  const res = { json: jest.fn() };
  await listTodos(req, res);
  expect(res.json).toHaveBeenCalledWith([{ id: 1, task: "Mocked task" }]);
});


import * as ToDoModel from "../models/todo.models.js";
import {
  getTodosService,
  createTodoService,
  toggleTodoByIdService,
  deleteTodoByIdService,
} from "../services/todo.service.js";

// ─── Setup ──────────────────────────────────────────────────────────────────

// `beforeEach` runs before EVERY test below.
// Clearing mocks makes sure one test's fake data doesn't bleed into the next.
beforeEach(() => {
  jest.clearAllMocks();
});

// ═══════════════════════════════════════════════════════════════════════════
// getTodosService
// ═══════════════════════════════════════════════════════════════════════════
describe("getTodosService", () => {
  test("returns whatever the model gives back", async () => {
    // Arrange: tell the fake model what to return
    const fakeTodos = [
      { id: 1, task: "Buy milk", completed: false },
      { id: 2, task: "Walk dog", completed: true },
    ];
    ToDoModel.getAllTodos.mockResolvedValue(fakeTodos);

    // Act: call the service
    const result = await getTodosService();

    // Assert: the service should return the same list unchanged
    expect(result).toEqual(fakeTodos);
  });

  test("calls the model exactly once", async () => {
    ToDoModel.getAllTodos.mockResolvedValue([]);

    await getTodosService();

    // The model should be called once — not zero times, not twice
    expect(ToDoModel.getAllTodos).toHaveBeenCalledTimes(1);
  });

  test("returns an empty array when there are no todos", async () => {
    ToDoModel.getAllTodos.mockResolvedValue([]);

    const result = await getTodosService();

    expect(result).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// createTodoService
// ═══════════════════════════════════════════════════════════════════════════
describe("createTodoService", () => {
  test("creates a todo when given a valid task string", async () => {
    // Arrange
    const newTodo = { id: 3, task: "Learn Jest", completed: false };
    ToDoModel.createTodo.mockResolvedValue(newTodo);

    // Act
    const result = await createTodoService("Learn Jest");

    // Assert
    expect(result).toEqual(newTodo);
    // Make sure the service actually forwarded the task to the model
    expect(ToDoModel.createTodo).toHaveBeenCalledWith("Learn Jest");
  });

  // ── Invalid input tests ──────────────────────────────────────────────────
  // These all test the validation guard at the top of createTodoService.
  // None of them should reach the model at all.

test("throws when task is undefined", async () => {
    await expect(createTodoService(undefined)).rejects.toThrow();
});

  test("throws when task is null", async () => {
    await expect(createTodoService(null)).rejects.toThrow();
  });

  test("throws when task is an empty string", async () => {
    await expect(createTodoService("")).rejects.toThrow();
  });

  test("throws when task is only whitespace", async () => {
    // "   " should be treated the same as "" after .trim()
    await expect(createTodoService("   ")).rejects.toThrow();
  });

  test("throws when task is a number instead of a string", async () => {
    await expect(createTodoService(42)).rejects.toThrow();
  });

  test("does NOT call the model when the task is invalid", async () => {
    // If validation fails, we should bail out before touching the database
    try {
      await createTodoService("");
    } catch {
      // expected to throw — we just want to check the model was never called
    }
    expect(ToDoModel.createTodo).not.toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// toggleTodoByIdService
// ═══════════════════════════════════════════════════════════════════════════
describe("toggleTodoByIdService", () => {
  test("returns the toggled todo when the id exists", () => {
    const toggled = { id: 1, task: "Buy milk", completed: true };
    ToDoModel.toggleTodoById.mockReturnValue(toggled);

    const result = toggleTodoByIdService(1);

    expect(result).toEqual(toggled);
    expect(ToDoModel.toggleTodoById).toHaveBeenCalledWith(1);
  });

  test("returns null (or undefined) when the id does not exist", () => {
    // The model returns null for a missing id
    ToDoModel.toggleTodoById.mockReturnValue(null);

    const result = toggleTodoByIdService(999);

    expect(result).toBeNull();
  });

  test("passes the id to the model unchanged", () => {
    ToDoModel.toggleTodoById.mockReturnValue({ id: 5, task: "x", completed: false });

    toggleTodoByIdService(5);

    expect(ToDoModel.toggleTodoById).toHaveBeenCalledWith(5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// deleteTodoByIdService
// ═══════════════════════════════════════════════════════════════════════════
describe("deleteTodoByIdService", () => {
  test("returns the deleted todo when the id exists", () => {
    const deleted = { id: 2, task: "Walk dog", completed: false };
    ToDoModel.deleteTodoById.mockReturnValue(deleted);

    const result = deleteTodoByIdService(2);

    expect(result).toEqual(deleted);
    expect(ToDoModel.deleteTodoById).toHaveBeenCalledWith(2);
  });

  test("returns null (or undefined) when the id does not exist", () => {
    ToDoModel.deleteTodoById.mockReturnValue(null);

    const result = deleteTodoByIdService(999);

    expect(result).toBeNull();
  });

  test("calls the model exactly once per call", () => {
    ToDoModel.deleteTodoById.mockReturnValue({ id: 1, task: "x", completed: false });

    deleteTodoByIdService(1);

    expect(ToDoModel.deleteTodoById).toHaveBeenCalledTimes(1);
  });
});