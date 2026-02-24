# Bibek Spring 2026 Web Dev II

This project follows a layered structure:

```
Routes → Controllers → Services → Models
```

## What Everything Does

### Routes
Define API endpoints and map them to controller functions.

### Controllers
Handle:
- Request parsing
- Response formatting
- HTTP status codes

Controllers **do not** control anything to do with business logic

### Services
Contain business logic:
- Validation
- Data processing
- Error handling rules

Services do *not** directly talk to HTTP.

### Models
Interact with Sequelize and the database.
---

# Installation

## Clone the forked repo

```bash
git clone SP_DEMO_....

```

---

## install dependencies needed for node

```bash
npm install
```

---

## install dev dependencies needed for JEST (if not grabbed from package.json)

```bash
npm install --save-dev jest supertest
```

---

# env folder

create a `.env` file in the root of the project
do not commit to github, add to .`gitignore`

example below 
```
PORT=8080
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=passowrd
DB_NAME=todo_db
DB_PORT=8080
```

---

# Setup for Mac. (TODO WINDOWS / LINUX)

## Start mysql (Mac)

```bash
brew services start mysql
```

## Login to mysql

```bash
mysql -u root -p
```

## Create database

```sql
CREATE DATABASE todo_db;
```

Sequelize should automatically create the tables if configured correctly.

---

# Starting app

Start the server:

```bash
npm run dev
```

Server will run on port specified (i did 8080):

```
http://localhost:8080
```

Base route for todos:

```
http://localhost:8080/api/todos
```

---

# API endpoints

## Get All Todos

```
GET /api/todos
```

Response:
```json
[
  {
    "id": 1,
    "task": "Learning how to properly wright test cases,"
    "completed": false
  }
]
```

---

## Create Todo

```
POST /api/todos
```

Body:
```json
{
  "task": "Write documentation"
}
```

Response:
```json
{
  "id": 2,
  "task": "Write documentation",
  "completed": false
}
```

---

# Testing 


## Why Unit Testing?

- Ensures business logic works
- Allows safe refactoring
- Avoids hitting the real database (via mocks)

---

## Test File Naming Convention

Jest automatically detects:

```
*.test.js
```

Where tests likve (literature focused):

```
src/
  services/
    todo.service.js
    todo.service.test.js
  controllers/
    todo.controllers.js
    todo.controllers.test.js
```

---

## Runring Tests

For all test suites to run:

```bash
npm test
```
Otherwise, run 

```bash
npm test <path/to/the/test/file>

# Exmaple test run for controller
npm test src/controllers/todo.controllers.test.js
```
---

# Issues I ran into

## Cannot GET /

Cause:
Routes are mounted at `/api/todos`, not `/`.

Corrected URL:
```
http://localhost:8080/api/todos
```

---

## Access denied for user ''@'localhost'

Cause:
Missing or incorrect DB credentials in `.env`.

Fix:
- Check DB_USER
- Check DB_PASSWORD
- Restart server
- Nuke everything and restart

---

## Failed to create schema directory (MySQL)

Cause:
Corrupted MySQL data directory.

Fix:
- Stop MySQL service
- Reinstall MySQL
- Restart service

---

## Cannot use import statement outside a module (Jest)

Cause:
Project uses ES modules but Jest defaults to CommonJS.

Fix:
Use:

```json
"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
```

---

## Zombie MySQL Process Blocking Port


```
ERROR [MY-010259] [Server] Another process with pid 65969 is using unix socket file.
ERROR [MY-010268] [Server] Unable to setup unix socket lock file.
```

**Cause:** A previous MySQL process didn't shut down properly and is still holding the socket file, preventing new instances from starting.

**What is a "zombie process"?**
A zombie process is a process that has finished executing but still has an entry in the process table. In this case, an old MySQL server process was stuck and blocking the socket files (`/tmp/mysql.sock` and `/tmp/mysqlx.sock`) that new MySQL instances need to use.

**Solution:**
1. Kill the stuck process:
   ```bash
   kill -9 65969
   ```

2. Clean up socket files:
   ```bash
   rm -f /tmp/mysql.sock
   rm -f /tmp/mysqlx.sock
   ```

3. Restart MySQL:
   ```bash
   brew services start mysql
   ```

4. Verify it's running:
   ```bash
   brew services list | grep mysql
   ```

make sure to stop MySQL properly using `brew services stop mysql` instead of force-quitting or killing the process.
