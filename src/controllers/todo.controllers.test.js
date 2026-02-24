/**
 * todo.controllers.test.js
 *
 * Tests for the CONTROLLER layer (todo.controllers.js).
 * Controllers sit between the router and the service.  Their job is to:
 *   1. Pull data out of the HTTP request (req.body, req.params, …)
 *   2. Call the right service function
 *   3. Send the correct HTTP response (status code + JSON body)
 *
 * Since here we only testing the controller, we mock the service so we can
 * control exactly what it returns (or throws) for each test case.
 *
 * we can also create fake `req` and `res` objects instead of using a real HTTP
 * server --> hits fast and simple on best test cases
 *
 * run by:  npx jest todo.controllers.test.js
 * after jest is installed and configured in package.json
 */

//Imports from JEST
import {
  jest,
  beforeEach,
  describe,
  test,
  expect
} from '@jest/globals';

// mock the service module path
jest.unstable_mockModule("../services/todo.service.js", () => ({
  getTodosService: jest.fn(),
  createTodoService: jest.fn(),
  toggleTodoByIdService: jest.fn(),
  deleteTodoByIdService: jest.fn(),
}));

// dynamic imports for mocked modules
const { getTodosService, createTodoService, toggleTodoByIdService, deleteTodoByIdService } = 
  await import("../services/todo.service.js");

const { listTodos, createTodos, toggleTodo, removeTodo } = 
  await import("../controllers/todo.controllers.js");


/**
 * makeRes() builds a fake Express `res` (response) object.
 * Instead of sending a real HTTP response, its methods just record what was
 * called so we can check them in our assertions.
 *
 * Usage:
 *   const res = makeRes();
 *   // … run the controller …
 *   expect(res.status).toHaveBeenCalledWith(201);
 *   expect(res.json).toHaveBeenCalledWith({ ... });
 */

function makeRes() {
  const res = {
    // `status()` returns `res` so controllers can chain: res.status(400).json(...)
    status: jest.fn().mockReturnThis(),
    json:   jest.fn().mockReturnThis(),
  };
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
});


// listTodos
describe("listTodos", () => {
  test("responds with count and todos array", async () => {
    // arrange: fake service returns two todos
    const fakeTodos = [
      { id: 1, task: "Buy milk", completed: false },
      { id: 2, task: "Walk dog", completed: true },
    ];
    getTodosService.mockResolvedValue(fakeTodos);

    const req = {};           // listTodos doesn't read anything from req
    const res = makeRes();

    // act
    await listTodos(req, res);

    // assert: the response JSON should include a count and the todos list
    expect(res.json).toHaveBeenCalledWith({
      count: 2,
      todos: fakeTodos,
    });
  });

  test("count is 0 when there are no todos", async () => {
    getTodosService.mockResolvedValue([]);

    const res = makeRes();
    await listTodos({}, res);

    expect(res.json).toHaveBeenCalledWith({ count: 0, todos: [] });
  });
});


// createTodos
describe("createTodos", () => {
  test("responds with 201 and the new todo on success", async () => {
    const newTodo = { id: 3, task: "Learn Jest", completed: false };
    createTodoService.mockResolvedValue(newTodo);

    // the controller reads `task` from req.body
    const req = { body: { task: "Learn Jest" } };
    const res = makeRes();

    await createTodos(req, res);

    // should set status 201 …
    expect(res.status).toHaveBeenCalledWith(201);
    // … then json({ message: "Created", todo: newTodo })
    expect(res.json).toHaveBeenCalledWith({ message: "Created", todo: newTodo });
  });

  test("responds with 400 when the service throws (e.g. empty task)", async () => {
    // service throws because the task is invalid
    createTodoService.mockRejectedValue(new Error("Invalid task"));

    const req = { body: { task: "" } };
    const res = makeRes();

    await createTodos(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    // the error message from the thrown error should appear in the response
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid task" });
  });

  test("responds with 400 when task is missing from body", async () => {
    createTodoService.mockRejectedValue(new Error("Invalid task"));

    const req = { body: {} }; // no `task` key at all
    const res = makeRes();

    await createTodos(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("passes the task from req.body to the service", async () => {
    createTodoService.mockResolvedValue({ id: 1, task: "Read docs", completed: false });

    const req = { body: { task: "Read docs" } };
    const res = makeRes();

    await createTodos(req, res);

    // verify the controller forwarded the correct value
    expect(createTodoService).toHaveBeenCalledWith("Read docs");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// toggleTodo
// ═══════════════════════════════════════════════════════════════════════════
describe("toggleTodo", () => {
  test("responds with the toggled todo on success", () => {
    const toggled = { id: 1, task: "Buy milk", completed: true };
    toggleTodoByIdService.mockReturnValue(toggled);

    // express stores URL params as strings, so req.params.id is "1" not 1
    const req = { params: { id: "1" } };
    const res = makeRes();

    toggleTodo(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Toggled", todo: toggled });
  });

  test("converts the id param to a Number before calling the service", () => {
    const toggled = { id: 2, task: "Walk dog", completed: false };
    toggleTodoByIdService.mockReturnValue(toggled);

    const req = { params: { id: "2" } };
    const res = makeRes();

    toggleTodo(req, res);

    // service expects a number, not a string
    expect(toggleTodoByIdService).toHaveBeenCalledWith(2);
  });

  test("responds with 400 when the todo is not found", () => {
    // the service returns null to signal "not found"
    toggleTodoByIdService.mockReturnValue(null);

    const req = { params: { id: "999" } };
    const res = makeRes();

    toggleTodo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Todo not found" });
  });
});


// removeTodo
describe("removeTodo", () => {
  test("responds with a success message when the todo is deleted", () => {
    const deleted = { id: 1, task: "Buy milk", completed: false };
    deleteTodoByIdService.mockReturnValue(deleted);

    const req = { params: { id: "1" } };
    const res = makeRes();

    removeTodo(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Deleted Successfully" });
  });

  test("converts the id param to a Number before calling the service", () => {
    deleteTodoByIdService.mockReturnValue({ id: 3, task: "x", completed: false });

    const req = { params: { id: "3" } };
    const res = makeRes();

    removeTodo(req, res);

    expect(deleteTodoByIdService).toHaveBeenCalledWith(3);
  });

  test("responds with 400 when the todo is not found", () => {
    deleteTodoByIdService.mockReturnValue(null);

    const req = { params: { id: "999" } };
    const res = makeRes();

    removeTodo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Todo not found" });
  });
});