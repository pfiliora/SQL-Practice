-- UP

CREATE TABLE Company (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT    NOT NULL,
  age TEXT   NOT NULL,
  address  CHAR (50),
  salary REAL  NOT NULL
);

CREATE TABLE Department (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name CHAR (100)
);

CREATE TABLE Employment (
    employee_id  INTEGER    NOT NULL,
    dept_id  INTEGER    NOT NULL
);

-- DOWN

DROP TABLE Company;
DROP TABLE Department;
DROP TABLE Employment;