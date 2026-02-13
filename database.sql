CREATE DATABASE todo_db;


USE todo_do;

CREATE TABLE todos(
id INT AUTO_INCREMENT PRIMARY KEY,
task VARCHAR(255),

completed BOOLEAN DEFAULT FALSE,
in_use BOOLEAN DEFAULT TRUE);



INSERT INTO todos(task) VALUES
("Demo MYSQL Connection"),
("Complete Model"),
("Complete Server");

SELECT id, task, completed FROM todos;
SELECT id, name, task, completed FROM todos WHERE name="nitin";