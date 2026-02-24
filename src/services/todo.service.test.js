/**
 * todo.service.test.js
 *
 * tests for the SERVICE layer (todo.service.js).
 * The service layer holds your business logic — it calls the model (database),
 * but knows nothing about HTTP requests or responses.
 *
 * We use "mocking" here: instead of hitting a real database, we fake the
 * model functions so our tests are fast, isolated, and predictable.
 *
 * run these tests with:  npx jest todo.service.test.js
 * after jest is installed and configured in package.json
 */

// imports from JEST

import {
    jest,
    beforeEach,
    describe,
    test,
    expect
  } from '@jest/globals';
  
  // mocking the models module
  jest.unstable_mockModule("../models/todo.models.js", () => ({
    getAllTodos: jest.fn(),
    createTodo: jest.fn(),
    toggleTodoById: jest.fn(),
    deleteTodoById: jest.fn(),
  }));
  
  // dynamic import of the mocked model and the service we're testing
  const ToDoModel = await import("../models/todo.models.js");
  
  const { getTodosService, createTodoService, toggleTodoByIdService, deleteTodoByIdService } = 
    await import("./todo.service.js");
  
  // start tests
  
  // `beforeEach` runs before EVERY test below.
  // clearing mocks makes sure one test's fake data doesn't affect any other test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  

  // getTodosService
  describe("getTodosService", () => {
    test("returns whatever the model gives back", async () => {
      // arranging tell the fake model what to return
      const fakeTodos = [
        { id: 1, task: "Buy milk", completed: false },
        { id: 2, task: "Walk dog", completed: true },
      ];
      ToDoModel.getAllTodos.mockResolvedValue(fakeTodos);
  
      // act: call the service
      const result = await getTodosService();
  
      // assert: the service should return the same list unchanged
      expect(result).toEqual(fakeTodos);
    });
  
    test("calls the model exactly once", async () => {
      ToDoModel.getAllTodos.mockResolvedValue([]);
  
      await getTodosService();
  
      // model should be called once — not zero times, not twice
      expect(ToDoModel.getAllTodos).toHaveBeenCalledTimes(1);
    });
  
    test("returns an empty array when there are no todos", async () => {
      ToDoModel.getAllTodos.mockResolvedValue([]);
  
      const result = await getTodosService();
  
      expect(result).toEqual([]);
    });
  });
  

  // createTodoService
  describe("createTodoService", () => {
    test("creates a todo when given a valid task string", async () => {
      // arrange
      const newTodo = { id: 3, task: "Learn Jest", completed: false };
      ToDoModel.createTodo.mockResolvedValue(newTodo);
  
      // act
      const result = await createTodoService("Learn Jest");
  
      // assert
      expect(result).toEqual(newTodo);
      // make sure the service actually forwarded the task to the model
      expect(ToDoModel.createTodo).toHaveBeenCalledWith("Learn Jest");
    });
  

    // INVALID INPUT TESTS

    // these all test the validation guard at the top of createTodoService.
    // none of them should reach the model at all.
  
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
      // if validation fails, we should bail out before touching the database
      try {
        await createTodoService("");
      } catch {
        // expected to throw — we just want to check the model was never called
      }
      expect(ToDoModel.createTodo).not.toHaveBeenCalled();
    });
  });
  
  // toggleTodoByIdService
  describe("toggleTodoByIdService", () => {
    test("returns the toggled todo when the id exists", () => {
      const toggled = { id: 1, task: "Buy milk", completed: true };
      ToDoModel.toggleTodoById.mockReturnValue(toggled);
  
      const result = toggleTodoByIdService(1);
  
      expect(result).toEqual(toggled);
      expect(ToDoModel.toggleTodoById).toHaveBeenCalledWith(1);
    });
  
    test("returns null (or undefined) when the id does not exist", () => {
      // the model returns null for a missing id
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
  
  // deleteTodoByIdService
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