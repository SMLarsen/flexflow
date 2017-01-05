DROP TABLE answer;
DROP TABLE item;
DROP TABLE category;
DROP TABLE users;


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(200) UNIQUE NOT NULL,
  clearance_level INT NOT NULL DEFAULT 0
);

INSERT INTO users (email) 
VALUES ('stevelarsen01@gmail.com'),
('lhien11@gmail.com')
;

SELECT * FROM users;

CREATE TABLE category (
    category_id serial PRIMARY KEY,
    category_name  character varying(20),
    category_sequence integer,
    category_type character varying(6) 
);

INSERT INTO category (category_name, category_sequence, category_type) 
VALUES ('Take Home', 1, 'credit'),
('Flex', 2, 'debit'),
('Flow', 3, 'debit'),
('Functional', 4, 'debit')
;

SELECT * FROM category;

CREATE TABLE item (
    item_id serial PRIMARY KEY,
    category_id INTEGER REFERENCES category,
    item_name  character varying(20),
    item_sequence integer,
    item_text character varying(255), 
    item_description text, 
    item_input_mode character varying(10)
);

INSERT INTO item (item_name, category_id, item_sequence, item_text, item_description, item_input_mode) 
VALUES ('Holidays', 2, 1, 'Holidays', 'Enter monthly holiday expenses.  For example, you may put $200 for Christmas in December', 'V'),
('Birthdays', 2, 2, 'Birthdays', 'Enter monthly birthday expenses.  For example, you may put $200 for your partner in May, and $20 for Aunt Sally in July', 'V'),
('Housing', 4, 1, 'Rent | Mortgage', 'Enter monthly expense for housing.', 'F')

;

SELECT * FROM item;

DROP TABLE budget;

CREATE TABLE budget (
    budget_id serial PRIMARY KEY,
    user_id INTEGER REFERENCES users,
    budget_year integer
);

INSERT INTO budget (user_id, budget_year) 
VALUES (1, 2017),
(2, 2017)
;

SELECT * FROM budget;


CREATE TABLE answer (
    answer_id serial PRIMARY KEY,
    budget_id INTEGER REFERENCES budget,
    answer_name character varying(20),
    answer_sequence integer,
    answer_text character varying(255), 
    value_monthly INTEGER,
    value_01 INTEGER,
    value_02 INTEGER,
    value_03 INTEGER,
    value_04 INTEGER,
    value_05 INTEGER,
    value_06 INTEGER,
    value_07 INTEGER,
    value_08 INTEGER,
    value_09 INTEGER,
    value_10 INTEGER,
    value_11 INTEGER,
    value_12 INTEGER,
    value_yearly INTEGER
);

INSERT INTO answer (budget_id, answer_name,
    answer_sequence,
    answer_text, 
    value_monthly,
    value_01,
    value_02,
    value_03,
    value_04,
    value_05,
    value_06,
    value_07,
    value_08,
    value_09,
    value_10,
    value_11,
    value_12,
    value_yearly) 
VALUES (1, 'Holidays', 1, 'Holidays', null, 0, 100, 0, 0, 100, 0, 100, 0, 0, 0, 100, 200, 600),
(1, 'Birthdays', 2, 'Birthdays', null, 0, 0, 0, 0, 0, 200, 0, 0, 0, 200, 0, 0, 400),
(1, 'Birthdays', 2, 'Birthdays', null, 0, 0, 0, 0, 0, 200, 0, 0, 0, 200, 0, 0, 400)
;

SELECT * FROM answer;









