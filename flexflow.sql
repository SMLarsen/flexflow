
DROP TABLE budget_flow_item;
DROP TABLE budget_item;
DROP TABLE budget_comment;
DROP TABLE budget;
DROP TABLE users;
DROP TABLE budget_template_item;
DROP TABLE budget_template_category;


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

CREATE TABLE budget (
    id serial PRIMARY KEY,
    user_id INTEGER REFERENCES users,
    budget_start_month integer,
    budget_start_year integer,
    monthly_take_home_amount integer,
    annual_salary integer,
    meeting_scheduled boolean default false
);

INSERT INTO budget (user_id, budget_start_month, budget_start_year, monthly_take_home_amount, annual_salary, meeting_scheduled)
VALUES (1, 1, 01, 2017, 5000, 100000, true),
(2, 02, 2017, 7200, 120000, true)
;

SELECT * FROM budget;

CREATE TABLE budget_comment (
    id serial PRIMARY KEY,
    budget_id INTEGER REFERENCES budget,
    budget_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO budget_comment (budget_id, budget_comment)
VALUES (1, 1, 'Lorem ipsum dolor sit amet, ad mel persius labores perfecto.'),
(1, 1, 'Vis enim graeco ei.'),
(2, 'Ad mea ludus albucius oporteat, ex eros')
;

SELECT * FROM budget_comment;

CREATE TABLE budget_flow_item (
    id serial PRIMARY KEY,
    budget_id INTEGER REFERENCES budget,
    budget_template_category_id INTEGER REFERENCES budget_template_category,
    item_month integer,
    item_year integer,
    item_amount integer DEFAULT 0,
    item_name VARCHAR(30),
    item_sort_sequence integer
);

INSERT INTO budget_flow_item (budget_id, budget_template_category_id, item_month, item_year, item_amount, item_name, item_sort_sequence)
VALUES (1, 1, 1, 2017, 0, 'Holidays', 1),
(1, 1, 2, 2017, 100, 'Holidays', 1),
(1, 1, 3, 2017, 0, 'Holidays', 1),
(1, 1, 4, 2017, 0, 'Holidays', 1),
(1, 1, 5, 2017, 100, 'Holidays', 1),
(1, 1, 6, 2017, 50, 'Holidays', 1),
(1, 1, 7, 2017, 50, 'Holidays', 1),
(1, 1, 8, 2017, 0, 'Holidays', 1),
(1, 1, 9, 2017, 0, 'Holidays', 1),
(1, 1, 10, 2017, 100, 'Holidays', 1),
(1, 1, 11, 2017, 0, 'Holidays', 1),
(1, 1, 12, 2017, 200, 'Holidays', 1),
(1, 1, 1, 2017, 0, 'Birthdays', 2),
(1, 1, 2, 2017, 100, 'Birthdays', 2),
(1, 1, 3, 2017, 0, 'Birthdays', 2),
(1, 1, 4, 2017, 0, 'Birthdays', 2),
(1, 1, 5, 2017, 35, 'Birthdays', 2),
(1, 1, 6, 2017, 0, 'Birthdays', 2),
(1, 1, 7, 2017, 100, 'Birthdays', 2),
(1, 1, 8, 2017, 0, 'Birthdays', 2),
(1, 1, 9, 2017, 0, 'Birthdays', 2),
(1, 1, 10, 2017, 0, 'Birthdays', 2),
(1, 1, 11, 2017, 100, 'Birthdays', 2),
(1, 1, 12, 2017, 50, 'Birthdays', 2),
(1, 1, 1, 2017, 50, 'Stuff for Kids', 3),
(1, 1, 2, 2017, 50, 'Stuff for Kids', 3),
(1, 1, 3, 2017, 50, 'Stuff for Kids', 3),
(1, 1, 4, 2017, 50, 'Stuff for Kids', 3),
(1, 1, 5, 2017, 50, 'Stuff for Kids', 3),
(1, 1, 6, 2017, 50, 'Stuff for Kids', 3),
(1, 1, 7, 2017, 50, 'Stuff for Kids', 3),
(1, 1, 8, 2017, 50, 'Stuff for Kids', 3),
(1, 1, 9, 2017, 50, 'Stuff for Kids', 3),
(1, 1, 10, 2017, 50, 'Stuff for Kids', 3),
(1, 1, 11, 2017, 50, 'Stuff for Kids', 3),
(1, 1, 12, 2017, 50, 'Stuff for Kids', 3),
(1, 1, 1, 2017, 0, 'P&C Insurance', 4),
(1, 1, 2, 2017, 0, 'P&C Insurance', 4),
(1, 1, 3, 2017, 0, 'P&C Insurance', 4),
(1, 1, 4, 2017, 0, 'P&C Insurance', 4),
(1, 1, 5, 2017, 1000, 'P&C Insurance', 4),
(1, 1, 6, 2017, 0, 'P&C Insurance', 4),
(1, 1, 7, 2017, 0, 'P&C Insurance', 4),
(1, 1, 8, 2017, 0, 'P&C Insurance', 4),
(1, 1, 9, 2017, 0, 'P&C Insurance', 4),
(1, 1, 10, 2017, 0, 'P&C Insurance', 4),
(1, 1, 11, 2017, 1000, 'P&C Insurance', 4),
(1, 1, 12, 2017, 0, 'P&C Insurance', 4),
(1, 1, 1, 2017, 0, 'Trips/ Vacation', 5),
(1, 1, 2, 2017, 0, 'Trips/ Vacation', 5),
(1, 1, 3, 2017, 1000, 'Trips/ Vacation', 5),
(1, 1, 4, 2017, 0, 'Trips/ Vacation', 5),
(1, 1, 5, 2017, 0, 'Trips/ Vacation', 5),
(1, 1, 6, 2017, 0, 'Trips/ Vacation', 5),
(1, 1, 7, 2017, 0, 'Trips/ Vacation', 5),
(1, 1, 8, 2017, 0, 'Trips/ Vacation', 5),
(1, 1, 9, 2017, 0, 'Trips/ Vacation', 5),
(1, 1, 10, 2017, 0, 'Trips/ Vacation', 5),
(1, 1, 11, 2017, 0, 'Trips/ Vacation', 5),
(1, 1, 12, 2017, 500, 'Trips/ Vacation', 5),
(1, 1, 1, 2017, 40, 'Car/Home Maintenance', 6),
(1, 1, 2, 2017, 40, 'Car/Home Maintenance', 6),
(1, 1, 3, 2017, 40, 'Car/Home Maintenance', 6),
(1, 1, 4, 2017, 40, 'Car/Home Maintenance', 6),
(1, 1, 5, 2017, 40, 'Car/Home Maintenance', 6),
(1, 1, 6, 2017, 40, 'Car/Home Maintenance', 6),
(1, 1, 7, 2017, 40, 'Car/Home Maintenance', 6),
(1, 1, 8, 2017, 40, 'Car/Home Maintenance', 6),
(1, 1, 9, 2017, 40, 'Car/Home Maintenance', 6),
(1, 1, 10, 2017, 40, 'Car/Home Maintenance', 6),
(1, 1, 11, 2017, 40, 'Car/Home Maintenance', 6),
(1, 1, 12, 2017, 40, 'Car/Home Maintenance', 6),
(1, 1, 1, 2017, 0, 'Auto Registration', 7),
(1, 1, 2, 2017, 0, 'Auto Registration', 7),
(1, 1, 3, 2017, 0, 'Auto Registration', 7),
(1, 1, 4, 2017, 0, 'Auto Registration', 7),
(1, 1, 5, 2017, 200, 'Auto Registration', 7),
(1, 1, 6, 2017, 0, 'Auto Registration', 7),
(1, 1, 7, 2017, 0, 'Auto Registration', 7),
(1, 1, 8, 2017, 0, 'Auto Registration', 7),
(1, 1, 9, 2017, 200, 'Auto Registration', 7),
(1, 1, 10, 2017, 0, 'Auto Registration', 7),
(1, 1, 11, 2017, 0, 'Auto Registration', 7),
(1, 1, 12, 2017, 0, 'Auto Registration', 7),
(1, 1, 1, 2017, 150, 'Personal Care', 8),
(1, 1, 2, 2017, 40, 'Personal Care', 8),
(1, 1, 3, 2017, 40, 'Personal Care', 8),
(1, 1, 4, 2017, 40, 'Personal Care', 8),
(1, 1, 5, 2017, 40, 'Personal Care', 8),
(1, 1, 6, 2017, 40, 'Personal Care', 8),
(1, 1, 7, 2017, 40, 'Personal Care', 8),
(1, 1, 8, 2017, 150, 'Personal Care', 8),
(1, 1, 9, 2017, 40, 'Personal Care', 8),
(1, 1, 10, 2017, 40, 'Personal Care', 8),
(1, 1, 11, 2017, 40, 'Personal Care', 8),
(1, 1, 12, 2017, 40, 'Personal Care', 8),
(1, 1, 1, 2017, 50, 'Cash (Other / Random)', 9),
(1, 1, 2, 2017, 50, 'Cash (Other / Random)', 9),
(1, 1, 3, 2017, 50, 'Cash (Other / Random)', 9),
(1, 1, 4, 2017, 50, 'Cash (Other / Random)', 9),
(1, 1, 5, 2017, 50, 'Cash (Other / Random)', 9),
(1, 1, 6, 2017, 50, 'Cash (Other / Random)', 9),
(1, 1, 7, 2017, 50, 'Cash (Other / Random)', 9),
(1, 1, 8, 2017, 50, 'Cash (Other / Random)', 9),
(1, 1, 9, 2017, 50, 'Cash (Other / Random)', 9),
(1, 1, 10, 2017, 50, 'Cash (Other / Random)', 9),
(1, 1, 11, 2017, 50, 'Cash (Other / Random)', 9),
(1, 1, 12, 2017, 50, 'Cash (Other / Random)', 9),
(2, 1, 1, 2017, 0, 'Holidays', 1),
(2, 1, 2, 2017, 100, 'Holidays', 1),
(2, 1, 3, 2017, 0, 'Holidays', 1),
(2, 1, 4, 2017, 0, 'Holidays', 1),
(2, 1, 5, 2017, 100, 'Holidays', 1),
(2, 1, 6, 2017, 50, 'Holidays', 1),
(2, 1, 7, 2017, 50, 'Holidays', 1),
(2, 1, 8, 2017, 0, 'Holidays', 1),
(2, 1, 9, 2017, 0, 'Holidays', 1),
(2, 1, 10, 2017, 100, 'Holidays', 1),
(2, 1, 11, 2017, 0, 'Holidays', 1),
(2, 1, 12, 2017, 200, 'Holidays', 1),
(2, 1, 1, 2017, 0, 'Birthdays', 2),
(2, 1, 2, 2017, 100, 'Birthdays', 2),
(2, 1, 3, 2017, 0, 'Birthdays', 2),
(2, 1, 4, 2017, 0, 'Birthdays', 2),
(2, 1, 5, 2017, 35, 'Birthdays', 2),
(2, 1, 6, 2017, 0, 'Birthdays', 2),
(2, 1, 7, 2017, 100, 'Birthdays', 2),
(2, 1, 8, 2017, 0, 'Birthdays', 2),
(2, 1, 9, 2017, 0, 'Birthdays', 2),
(2, 1, 10, 2017, 0, 'Birthdays', 2),
(2, 1, 11, 2017, 100, 'Birthdays', 2),
(2, 1, 12, 2017, 50, 'Birthdays', 2),
(2, 1, 1, 2017, 50, 'Stuff for Kids', 3),
(2, 1, 2, 2017, 50, 'Stuff for Kids', 3),
(2, 1, 3, 2017, 50, 'Stuff for Kids', 3),
(2, 1, 4, 2017, 50, 'Stuff for Kids', 3),
(2, 1, 5, 2017, 50, 'Stuff for Kids', 3),
(2, 1, 6, 2017, 50, 'Stuff for Kids', 3),
(2, 1, 7, 2017, 50, 'Stuff for Kids', 3),
(2, 1, 8, 2017, 50, 'Stuff for Kids', 3),
(2, 1, 9, 2017, 50, 'Stuff for Kids', 3),
(2, 1, 10, 2017, 50, 'Stuff for Kids', 3),
(2, 1, 11, 2017, 50, 'Stuff for Kids', 3),
(2, 1, 12, 2017, 50, 'Stuff for Kids', 3),
(2, 1, 1, 2017, 0, 'P&C Insurance', 4),
(2, 1, 2, 2017, 0, 'P&C Insurance', 4),
(2, 1, 3, 2017, 0, 'P&C Insurance', 4),
(2, 1, 4, 2017, 0, 'P&C Insurance', 4),
(2, 1, 5, 2017, 1000, 'P&C Insurance', 4),
(2, 1, 6, 2017, 0, 'P&C Insurance', 4),
(2, 1, 7, 2017, 0, 'P&C Insurance', 4),
(2, 1, 8, 2017, 0, 'P&C Insurance', 4),
(2, 1, 9, 2017, 0, 'P&C Insurance', 4),
(2, 1, 10, 2017, 0, 'P&C Insurance', 4),
(2, 1, 11, 2017, 1000, 'P&C Insurance', 4),
(2, 1, 12, 2017, 0, 'P&C Insurance', 4),
(2, 1, 1, 2017, 0, 'Trips/ Vacation', 5),
(2, 1, 2, 2017, 0, 'Trips/ Vacation', 5),
(2, 1, 3, 2017, 1000, 'Trips/ Vacation', 5),
(2, 1, 4, 2017, 0, 'Trips/ Vacation', 5),
(2, 1, 5, 2017, 0, 'Trips/ Vacation', 5),
(2, 1, 6, 2017, 0, 'Trips/ Vacation', 5),
(2, 1, 7, 2017, 0, 'Trips/ Vacation', 5),
(2, 1, 8, 2017, 0, 'Trips/ Vacation', 5),
(2, 1, 9, 2017, 0, 'Trips/ Vacation', 5),
(2, 1, 10, 2017, 0, 'Trips/ Vacation', 5),
(2, 1, 11, 2017, 0, 'Trips/ Vacation', 5),
(2, 1, 12, 2017, 500, 'Trips/ Vacation', 5),
(2, 1, 1, 2017, 40, 'Car/Home Maintenance', 6),
(2, 1, 2, 2017, 40, 'Car/Home Maintenance', 6),
(2, 1, 3, 2017, 40, 'Car/Home Maintenance', 6),
(2, 1, 4, 2017, 40, 'Car/Home Maintenance', 6),
(2, 1, 5, 2017, 40, 'Car/Home Maintenance', 6),
(2, 1, 6, 2017, 40, 'Car/Home Maintenance', 6),
(2, 1, 7, 2017, 40, 'Car/Home Maintenance', 6),
(2, 1, 8, 2017, 40, 'Car/Home Maintenance', 6),
(2, 1, 9, 2017, 40, 'Car/Home Maintenance', 6),
(2, 1, 10, 2017, 40, 'Car/Home Maintenance', 6),
(2, 1, 11, 2017, 40, 'Car/Home Maintenance', 6),
(2, 1, 12, 2017, 40, 'Car/Home Maintenance', 6),
(2, 1, 1, 2017, 0, 'Auto Registration', 7),
(2, 1, 2, 2017, 0, 'Auto Registration', 7),
(2, 1, 3, 2017, 0, 'Auto Registration', 7),
(2, 1, 4, 2017, 0, 'Auto Registration', 7),
(2, 1, 5, 2017, 200, 'Auto Registration', 7),
(2, 1, 6, 2017, 0, 'Auto Registration', 7),
(2, 1, 7, 2017, 0, 'Auto Registration', 7),
(2, 1, 8, 2017, 0, 'Auto Registration', 7),
(2, 1, 9, 2017, 200, 'Auto Registration', 7),
(2, 1, 10, 2017, 0, 'Auto Registration', 7),
(2, 1, 11, 2017, 0, 'Auto Registration', 7),
(2, 1, 12, 2017, 0, 'Auto Registration', 7),
(2, 1, 1, 2017, 150, 'Personal Care', 8),
(2, 1, 2, 2017, 40, 'Personal Care', 8),
(2, 1, 3, 2017, 40, 'Personal Care', 8),
(2, 1, 4, 2017, 40, 'Personal Care', 8),
(2, 1, 5, 2017, 40, 'Personal Care', 8),
(2, 1, 6, 2017, 40, 'Personal Care', 8),
(2, 1, 7, 2017, 40, 'Personal Care', 8),
(2, 1, 8, 2017, 150, 'Personal Care', 8),
(2, 1, 9, 2017, 40, 'Personal Care', 8),
(2, 1, 10, 2017, 40, 'Personal Care', 8),
(2, 1, 11, 2017, 40, 'Personal Care', 8),
(2, 1, 12, 2017, 40, 'Personal Care', 8),
(2, 1, 1, 2017, 50, 'Cash (Other / Random)', 9),
(2, 1, 2, 2017, 50, 'Cash (Other / Random)', 9),
(2, 1, 3, 2017, 50, 'Cash (Other / Random)', 9),
(2, 1, 4, 2017, 50, 'Cash (Other / Random)', 9),
(2, 1, 5, 2017, 50, 'Cash (Other / Random)', 9),
(2, 1, 6, 2017, 50, 'Cash (Other / Random)', 9),
(2, 1, 7, 2017, 50, 'Cash (Other / Random)', 9),
(2, 1, 8, 2017, 50, 'Cash (Other / Random)', 9),
(2, 1, 9, 2017, 50, 'Cash (Other / Random)', 9),
(2, 1, 10, 2017, 50, 'Cash (Other / Random)', 9),
(2, 1, 11, 2017, 50, 'Cash (Other / Random)', 9),
(2, 1, 12, 2017, 50, 'Cash (Other / Random)', 9)
;

SELECT * FROM budget_flow_item;

SELECT category_name, budget_template_category_id, item_month, item_year, item_name, item_amount, item_sort_sequence
FROM budget_template_category, budget_flow_item
WHERE budget_template_category.id = budget_flow_item.budget_template_category_id
AND budget_id = 1
ORDER BY budget_template_category_id, item_year, item_month, item_sort_sequence
;


SELECT
    id,
    budget_template_category_id,
    item_month,
    item_year,
    item_amount,
    item_name,
    item_sort_sequence


CREATE TABLE budget_item (
    id serial PRIMARY KEY,
    budget_id INTEGER REFERENCES budget,
    budget_template_category_id INTEGER REFERENCES budget_template_category,
    item_name VARCHAR(30),
    item_amount integer,
    item_sort_sequence integer
);


INSERT INTO budget_item (budget_id, budget_template_category_id, item_name, item_amount, item_sort_sequence)
VALUES (1, 2, 'Steve', 500, 1),
(1, 2, 'Ellen', 500, 2),
(2, 2, 'Hien', 300, 1),
(1, 4, 'Insurance', 500, 1),
(1, 4, 'Investments', 300, 2),
(1, 4, 'Emergency Cash', 300, 3),
(2, 4, 'Insurance', 400, 1),
(2, 4, 'Investments', 1400, 2),
(1, 4, 'Emergency Cash', 300, 3),
(1, 3, 'Rent | Mortgage', 1000, 1),
(1, 3, 'Daycare', 700, 2),
(1, 3, 'Cars', 250, 3),
(1, 3, 'P&C Insurance', 135, 4),
(1, 3, 'Cell Phone', 120, 5),
(1, 3, 'Utilities', 200, 6),
(1, 3, 'Student Loans', 200, 7),
(1, 3, 'Credit Card | Loans', 100, 8),
(1, 3, 'Gas', 150, 9),
(2, 3,  'Groceries', 450, 10),
(2, 3, 'Rent | Mortgage', 1000, 1),
(2, 3, 'Daycare', 700, 2),
(2, 3, 'Cars', 250, 3),
(2, 3, 'P&C Insurance', 135, 4),
(2, 3, 'Cell Phone', 120, 5),
(2, 3, 'Utilities', 200, 6),
(2, 3, 'Student Loans', 200, 7),
(2, 3, 'Credit Card | Loans', 100, 8),
(2, 3, 'Gas', 150, 9),
(2, 3, 'Groceries', 450, 10)
;

SELECT category_name, budget_template_category_id, budget_id, item_name, item_amount, item_sort_sequence
FROM budget_template_category, budget_item
WHERE budget_template_category.id = budget_item.budget_template_category_id
AND budget_id = 1
ORDER BY budget_template_category_id, item_sort_sequence
;


CREATE TABLE budget_template_category(
    id serial PRIMARY KEY,
    category_name VARCHAR(20) UNIQUE NOT NULL,
    category_text TEXT
);

INSERT INTO budget_template_category (category_name, category_text)
VALUES ('Flow', 'Lorem ipsum dolor sit amet, ad mel persius labores perfecto. Vis enim graeco ei. Ad mea ludus albucius oporteat, ex eros quaestio appellantur sit. Cu usu reque errem, est mundi integre imperdiet ne. Eu his labitur electram. Vel eu nibh patrioque scriptorem, choro percipit apeirian cum ne.'),
('Flex', 'Ei has fugit constituto, ei nec alia sonet nominavi. Usu modo dico dolorem ad. Unum dolor tation ut his, no vix delicata inciderint. At quo atqui convenire intellegebat.'),
('Financial', 'Copiosae nominati nec ne. Mea partem tincidunt at, appareat dignissim ex vix. Per ne vide iusto labore. Eam erat audire necessitatibus at. Gloriatur rationibus ius ut, ne viderer inermis intellegam mel. Nec te tale feugait civibus, ad partem reprimique honestatis cum.'),
('Functional', 'Dolor aliquip copiosae per id, his aeque ludus erroribus no. Ad his alia tacimates. Ipsum exerci posidonium duo cu. Ut nec clita insolens disputando, ipsum eruditi vituperatoribus qui ut.')
;

SELECT * FROM budget_template_category;

CREATE TABLE budget_template_item(
    id serial PRIMARY KEY,
    budget_category_id INTEGER REFERENCES budget_template_category,
    item_name VARCHAR(30) NOT NULL,
    item_text TEXT,
    item_placeholder_text TEXT,
    item_img_src TEXT,
    item_sort_sequence INTEGER
);


INSERT INTO budget_template_item (budget_category_id, item_name, item_text, item_placeholder_text, item_img_src, item_sort_sequence)
VALUES (1, 'Holidays', 'appareat dignissim ex vix', 'Holidays', 'img1.jpg', 0),
(1, 'Birthdays', 'appareat dignissim ex vix', 'Birthdays', 'img2.jpg', 1),
(1, 'Stuff for Kids', 'appareat dignissim ex vix', 'Stuff for Kids', 'img3.jpg',2),
(1, 'P&C Insurance', 'appareat dignissim ex vix', 'P&C Insurance', 'img4.jpg',3),
(1, 'Trips/ Vacation', 'appareat dignissim ex vix', 'Trips/ Vacation', 'img5.jpg', 4),
(1, 'Car/Home Maintenance', 'appareat dignissim ex vix', 'Car/Home Maintenance', 'img6.jpg', 5),
(1, 'Auto Registration', 'appareat dignissim ex vix', 'Auto Registration', 'img7.jpg', 6),
(1, 'Personal Care', 'appareat dignissim ex vix', 'Personal Care', 'img8.jpg', 7),
(1, 'Cash (Other / Random)', 'appareat dignissim ex vix', 'Cash (Other / Random)', 'img9.jpg', 8),
(2, 'appareat dignissim ex vix', 'Add flexer', 'img30.jpg', 0),
(4, 'Rent | Mortgage', 'appareat dignissim ex vix', 'Rent | Mortgage', 'img10.jpg', 0),
(4, 'Daycare', 'appareat dignissim ex vix', 'Daycare', 'img11.jpg', 1),
(4, 'Cars', 'appareat dignissim ex vix', 'Cars', 'img12.jpg', 2),
(4, 'P&C Insurance', 'appareat dignissim ex vix', 'P&C Insurance', 'img13.jpg', 3),
(4, 'Cell Phone', 'appareat dignissim ex vix', 'Cell Phone', 'img14.jpg', 4),
(4, 'Utilities', 'appareat dignissim ex vix', 'Utilities (water,gas,elec,cable)', 'img15.jpg', 5),
(4, 'Student Loans', 'appareat dignissim ex vix', 'Student Loans', 'img16.jpg', 6),
(4, 'Credit Card | Loans', 'appareat dignissim ex vix', 'Credit Card | Loans', 'img17.jpg', 7),
(4, 'Gas', 'appareat dignissim ex vix', 'Gas', 'img18.jpg', 8),
(4, 'Groceries', 'appareat dignissim ex vix', 'Groceries', 'img19.jpg', 9),
(3, 'Insurance', 'appareat dignissim ex vix', 'Insurance', 'img20.jpg', 0),
(3, 'Investments', 'appareat dignissim ex vix', 'Investments', 'img21.jpg', 1),
(3, 'Emergency Cash', 'appareat dignissim ex vix', 'Emergency Cash', 'img22.jpg', 2)
;

select * from budget_template_item
ORDER BY budget_category_id, item_sort_sequence
;

SELECT budget_template_category.category_name, budget_template_item.*
FROM budget_template_category, budget_template_item
WHERE budget_template_category.id = budget_category_id
ORDER BY budget_category_id, item_sort_sequence
;

SELECT * FROM budget_template_item
WHERE budget_category_id = 1
ORDER BY item_sort_sequence
;
