CREATE DATABASE todo_db;


USE todo_db;

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


ALTER TABLE tasks MODIFY COLUMN user_id INT NOT NULL;


CREATE TABLE tasks(task_id INT PRIMARY KEY AUTO_INCREMENT, 
		tasks VARCHAR(255), 
		completed BOOLEAN DEFAULT false,
		user_id INT NOT NULL,
		CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE);

CREATE TABLE users(user_id INT PRIMARY KEY AUTO_INCREMENT, 
			user_name VARCHAR(255),
			user_email VARCHAR(255) UNIQUE NOT NULL,
			user_ta VARCHAR(255) NOT NULL);


INSERT INTO users(user_email, user_password) value ("prince.patel@wright.edu", "jkashdfjh");

INSERT INTO tasks(tasks, user_id) VALUES ("COMPLETE DB TODAY", 2);