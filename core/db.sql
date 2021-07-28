-- to create a new database
CREATE DATABASE  CTE_EXERCISE;

-- to use database
USE CTE_EXERCISE;

-- creating a new table
DROP TABLE users;
CREATE TABLE users(
   id INT AUTO_INCREMENT PRIMARY KEY,
   username VARCHAR(255),
   password VARCHAR(40),
   firstname varchar(100),
   lastname varchar(100)   
);

DROP TABLE readings;
CREATE TABLE readings
( id int NOT NULL,
  systolic varchar(10),
  diastolic varchar(10),
  hr varchar(10)
  );

-- to show all tables
show tables;


-- to describe table
describe users;
describe readings;

-- Add sample data
INSERT INTO users (username, password, firstname, lastname) VALUES ("jane@example.com", "JanesPassword", "Jane", "Doe");
INSERT INTO users (username, password, firstname, lastname) VALUES ("bob@example.com", "BobsPassword", "Bob", "Smith");
INSERT INTO users (username, password, firstname, lastname) VALUES ("amy@example.com", "amyspassword", "Amy", "Smith");

INSERT INTO readings (id,  systolic, diastolic, hr) VALUES (1, "120", "60", "50");
INSERT INTO readings (id,  systolic, diastolic, hr) VALUES (1, "90", "45", "90");
INSERT INTO readings (id,  systolic, diastolic, hr) VALUES (2, "110", "55", "45");

