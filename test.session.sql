INSERT INTO employee
VALUES(1,"test","test","test",240);

INSERT INTO employee
VALUES(2,"test","test","test",240);

DELETE FROM employee
WHERE id = 1;

DELETE FROM employee
WHERE id = 2;

CREATE TABLE users(
      id INTEGER auto_increment,
      name varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      password varchar(255) NOT NULL,
      PRIMARY KEY(id)
);

SELECT * FROM users;