
DROP TABLE budget_flow_item;
DROP TABLE budget_item;
DROP TABLE budget_comment;
DROP TABLE budget;
DROP TABLE users;
DROP TABLE administration;
DROP TABLE budget_template_item;
DROP TABLE budget_template_category;

CREATE TABLE administration (
  id SERIAL PRIMARY KEY,
  parameter_name VARCHAR(30) UNIQUE NOT NULL,
  parameter_value VARCHAR(130) NOT NULL
);

INSERT INTO administration (parameter_name, parameter_value)
VALUES ('Scheduling_email', 'schedule.email@gmail.com'),
 ('Final_report_email', 'report.email01@gmail.com')
;


CREATE TABLE budget_template_category(
    id serial PRIMARY KEY,
    category_name VARCHAR(20) UNIQUE NOT NULL,
    category_text TEXT
);

INSERT INTO budget_template_category (category_name, category_text)
VALUES ('Flow', 'Lorem ipsum dolor sit amet, ad mel persius labores perfecto. Vis enim graeco ei. Ad mea ludus albucius oporteat, ex eros quaestio appellantur sit. Cu usu reque errem, est mundi integre imperdiet ne. Eu his labitur electram. Vel eu nibh patrioque scriptorem, choro percipit apeirian cum ne.'),
('Flex', 'Ei has fugit constituto, ei nec alia sonet nominavi. Usu modo dico dolorem ad. Unum dolor tation ut his, no vix delicata inciderint. At quo atqui convenire intellegebat.'),
('Functional', 'Copiosae nominati nec ne. Mea partem tincidunt at, appareat dignissim ex vix. Per ne vide iusto labore. Eam erat audire necessitatibus at. Gloriatur rationibus ius ut, ne viderer inermis intellegam mel. Nec te tale feugait civibus, ad partem reprimique honestatis cum.'),
('Financial', 'Dolor aliquip copiosae per id, his aeque ludus erroribus no. Ad his alia tacimates. Ipsum exerci posidonium duo cu. Ut nec clita insolens disputando, ipsum eruditi vituperatoribus qui ut.')
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
VALUES (1, 'Holidays', 'appareat dignissim ex vix', 'Holidays', 'holidays.svg', 0),
(1, 'Birthdays', 'appareat dignissim ex vix', 'Birthdays', 'birthdays.svg', 1),
(1, 'Stuff for Kids', 'appareat dignissim ex vix', 'Stuff for Kids', 'stuffforkids.svg',2),
(1, 'P&C Insurance', 'appareat dignissim ex vix', 'P&C Insurance', 'insurance.svg',3),
(1, 'Trips/ Vacation', 'appareat dignissim ex vix', 'Trips/ Vacation', 'vacation.svg', 4),
(1, 'Car/Home Maintenance', 'appareat dignissim ex vix', 'Car/Home Maintenance', 'maintenance.svg', 5),
(1, 'Auto Registration', 'appareat dignissim ex vix', 'Auto Registration', 'autoregistration.svg', 6),
(1, 'Personal Care', 'appareat dignissim ex vix', 'Personal Care', 'personalcare.svg', 7),
(1, 'Cash (Other / Random)', 'appareat dignissim ex vix', 'Cash (Other / Random)', 'emergencycash.svg', 8),
(2, 'Add flexor', 'appareat dignissim ex vix', 'Add flexer', 'img30.jpg', 0),
(3, 'Rent | Mortgage', 'appareat dignissim ex vix', 'Rent | Mortgage', 'mortgage.svg', 0),
(3, 'Daycare', 'appareat dignissim ex vix', 'Daycare', 'daycare.svg', 1),
(3, 'Cars', 'appareat dignissim ex vix', 'Cars', 'cars.svg', 2),
(3, 'P&C Insurance', 'appareat dignissim ex vix', 'P&C Insurance', 'insurance.svg', 3),
(3, 'Cell Phone', 'appareat dignissim ex vix', 'Cell Phone', 'cellphone.svg', 4),
(3, 'Utilities', 'appareat dignissim ex vix', 'Utilities (water,gas,elec,cable)', 'utilities.svg', 5),
(3, 'Student Loans', 'appareat dignissim ex vix', 'Student Loans', 'studentloans.svg', 6),
(3, 'Credit Card | Loans', 'appareat dignissim ex vix', 'Credit Card | Loans', 'loans.svg', 7),
(3, 'Gas', 'appareat dignissim ex vix', 'Gas', 'gas.svg', 8),
(3, 'Groceries', 'appareat dignissim ex vix', 'Groceries', 'groceries.svg', 9),
(4, 'Insurance', 'appareat dignissim ex vix', 'Insurance', 'insurance.svg', 0),
(4, 'Investments', 'appareat dignissim ex vix', 'Investments', 'investments.svg', 1),
(4, 'Emergency Cash', 'appareat dignissim ex vix', 'Emergency Cash', 'emergencycash.svg', 2)
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
    meeting_scheduled boolean default false,
    budget_status VARCHAR(20)
);

INSERT INTO budget (user_id, budget_start_month, budget_start_year, monthly_take_home_amount, annual_salary, meeting_scheduled)
VALUES (1, 01, 2017, 5000, 100000, true),
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
VALUES (1, 'Lorem ipsum dolor sit amet, ad mel persius labores perfecto.'),
(1, 'Vis enim graeco ei.'),
(2, 'Ad mea ludus albucius oporteat, ex eros')
;

SELECT * FROM budget_comment;

CREATE TABLE budget_flow_item (
    id serial PRIMARY KEY,
    budget_id INTEGER REFERENCES budget,
    budget_template_category_id INTEGER REFERENCES budget_template_category,
    item_month integer,
    item_year integer,
    item_img_src VARCHAR(30),
    item_amount integer DEFAULT 0,
    item_name VARCHAR(30),
    item_sort_sequence integer
);

INSERT INTO budget_flow_item (budget_id, budget_template_category_id, item_month, item_year, item_amount, item_name, item_img_src, item_sort_sequence)
VALUES (1, 1, 1, 2017, 0, 'Holidays', 'holidays.svg', 1),
(1, 1, 2, 2017, 100, 'Holidays', 'holidays.svg', 1),
(1, 1, 3, 2017, 0, 'Holidays', 'holidays.svg', 1),
(1, 1, 4, 2017, 0, 'Holidays', 'holidays.svg', 1),
(1, 1, 5, 2017, 100, 'Holidays', 'holidays.svg', 1),
(1, 1, 6, 2017, 50, 'Holidays', 'holidays.svg', 1),
(1, 1, 7, 2017, 50, 'Holidays', 'holidays.svg', 1),
(1, 1, 8, 2017, 0, 'Holidays', 'holidays.svg', 1),
(1, 1, 9, 2017, 0, 'Holidays', 'holidays.svg', 1),
(1, 1, 10, 2017, 100, 'Holidays', 'holidays.svg', 1),
(1, 1, 11, 2017, 0, 'Holidays', 'holidays.svg', 1),
(1, 1, 12, 2017, 200, 'Holidays', 'holidays.svg', 1),
(1, 1, 1, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(1, 1, 2, 2017, 100, 'Birthdays', 'birthdays.svg', 2),
(1, 1, 3, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(1, 1, 4, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(1, 1, 5, 2017, 35, 'Birthdays', 'birthdays.svg', 2),
(1, 1, 6, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(1, 1, 7, 2017, 100, 'Birthdays', 'birthdays.svg', 2),
(1, 1, 8, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(1, 1, 9, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(1, 1, 10, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(1, 1, 11, 2017, 100, 'Birthdays', 'birthdays.svg', 2),
(1, 1, 12, 2017, 50, 'Birthdays', 'birthdays.svg', 2),
(1, 1, 1, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(1, 1, 2, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(1, 1, 3, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(1, 1, 4, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(1, 1, 5, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(1, 1, 6, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(1, 1, 7, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(1, 1, 8, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(1, 1, 9, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(1, 1, 10, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(1, 1, 11, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(1, 1, 12, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(1, 1, 1, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(1, 1, 2, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(1, 1, 3, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(1, 1, 4, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(1, 1, 5, 2017, 1000, 'P&C Insurance', 'insurance.svg', 4),
(1, 1, 6, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(1, 1, 7, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(1, 1, 8, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(1, 1, 9, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(1, 1, 10, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(1, 1, 11, 2017, 1000, 'P&C Insurance', 'insurance.svg', 4),
(1, 1, 12, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(1, 1, 1, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(1, 1, 2, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(1, 1, 3, 2017, 1000, 'Trips/ Vacation', 'vacation.svg', 5),
(1, 1, 4, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(1, 1, 5, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(1, 1, 6, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(1, 1, 7, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(1, 1, 8, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(1, 1, 9, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(1, 1, 10, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(1, 1, 11, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(1, 1, 12, 2017, 500, 'Trips/ Vacation', 'vacation.svg', 5),
(1, 1, 1, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(1, 1, 2, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(1, 1, 3, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(1, 1, 4, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(1, 1, 5, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(1, 1, 6, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(1, 1, 7, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(1, 1, 8, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(1, 1, 9, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(1, 1, 10, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(1, 1, 11, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(1, 1, 12, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(1, 1, 1, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(1, 1, 2, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(1, 1, 3, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(1, 1, 4, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(1, 1, 5, 2017, 200, 'Auto Registration', 'autoregistration.svg', 7),
(1, 1, 6, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(1, 1, 7, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(1, 1, 8, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(1, 1, 9, 2017, 200, 'Auto Registration', 'autoregistration.svg', 7),
(1, 1, 10, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(1, 1, 11, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(1, 1, 12, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(1, 1, 1, 2017, 150, 'Personal Care', 'personalcare.svg', 8),
(1, 1, 2, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(1, 1, 3, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(1, 1, 4, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(1, 1, 5, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(1, 1, 6, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(1, 1, 7, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(1, 1, 8, 2017, 150, 'Personal Care', 'personalcare.svg', 8),
(1, 1, 9, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(1, 1, 10, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(1, 1, 11, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(1, 1, 12, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(1, 1, 1, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(1, 1, 2, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(1, 1, 3, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(1, 1, 4, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(1, 1, 5, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(1, 1, 6, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(1, 1, 7, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(1, 1, 8, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(1, 1, 9, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(1, 1, 10, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(1, 1, 11, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(1, 1, 12, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(2, 1, 1, 2017, 0, 'Holidays', 'holidays.svg', 1),
(2, 1, 2, 2017, 100, 'Holidays', 'holidays.svg', 1),
(2, 1, 3, 2017, 0, 'Holidays', 'holidays.svg', 1),
(2, 1, 4, 2017, 0, 'Holidays', 'holidays.svg', 1),
(2, 1, 5, 2017, 100, 'Holidays', 'holidays.svg', 1),
(2, 1, 6, 2017, 50, 'Holidays', 'holidays.svg', 1),
(2, 1, 7, 2017, 50, 'Holidays', 'holidays.svg', 1),
(2, 1, 8, 2017, 0, 'Holidays', 'holidays.svg', 1),
(2, 1, 9, 2017, 0, 'Holidays', 'holidays.svg', 1),
(2, 1, 10, 2017, 100, 'Holidays', 'holidays.svg', 1),
(2, 1, 11, 2017, 0, 'Holidays', 'holidays.svg', 1),
(2, 1, 12, 2017, 200, 'Holidays', 'holidays.svg', 1),
(2, 1, 1, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(2, 1, 2, 2017, 100, 'Birthdays', 'birthdays.svg', 2),
(2, 1, 3, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(2, 1, 4, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(2, 1, 5, 2017, 35, 'Birthdays', 'birthdays.svg', 2),
(2, 1, 6, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(2, 1, 7, 2017, 100, 'Birthdays', 'birthdays.svg', 2),
(2, 1, 8, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(2, 1, 9, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(2, 1, 10, 2017, 0, 'Birthdays', 'birthdays.svg', 2),
(2, 1, 11, 2017, 100, 'Birthdays', 'birthdays.svg', 2),
(2, 1, 12, 2017, 50, 'Birthdays', 'birthdays.svg', 2),
(2, 1, 1, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(2, 1, 2, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(2, 1, 3, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(2, 1, 4, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(2, 1, 5, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(2, 1, 6, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(2, 1, 7, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(2, 1, 8, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(2, 1, 9, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(2, 1, 10, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(2, 1, 11, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(2, 1, 12, 2017, 50, 'Stuff for Kids', 'stuffforkids.svg', 3),
(2, 1, 1, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(2, 1, 2, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(2, 1, 3, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(2, 1, 4, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(2, 1, 5, 2017, 1000, 'P&C Insurance', 'insurance.svg', 4),
(2, 1, 6, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(2, 1, 7, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(2, 1, 8, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(2, 1, 9, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(2, 1, 10, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(2, 1, 11, 2017, 1000, 'P&C Insurance', 'insurance.svg', 4),
(2, 1, 12, 2017, 0, 'P&C Insurance', 'insurance.svg', 4),
(2, 1, 1, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(2, 1, 2, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(2, 1, 3, 2017, 1000, 'Trips/ Vacation', 'vacation.svg', 5),
(2, 1, 4, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(2, 1, 5, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(2, 1, 6, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(2, 1, 7, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(2, 1, 8, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(2, 1, 9, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(2, 1, 10, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(2, 1, 11, 2017, 0, 'Trips/ Vacation', 'vacation.svg', 5),
(2, 1, 12, 2017, 500, 'Trips/ Vacation', 'vacation.svg', 5),
(2, 1, 1, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(2, 1, 2, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(2, 1, 3, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(2, 1, 4, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(2, 1, 5, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(2, 1, 6, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(2, 1, 7, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(2, 1, 8, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(2, 1, 9, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(2, 1, 10, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(2, 1, 11, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(2, 1, 12, 2017, 40, 'Car/Home Maintenance', 'maintenance.svg', 6),
(2, 1, 1, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(2, 1, 2, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(2, 1, 3, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(2, 1, 4, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(2, 1, 5, 2017, 200, 'Auto Registration', 'autoregistration.svg', 7),
(2, 1, 6, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(2, 1, 7, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(2, 1, 8, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(2, 1, 9, 2017, 200, 'Auto Registration', 'autoregistration.svg', 7),
(2, 1, 10, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(2, 1, 11, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(2, 1, 12, 2017, 0, 'Auto Registration', 'autoregistration.svg', 7),
(2, 1, 1, 2017, 150, 'Personal Care', 'personalcare.svg', 8),
(2, 1, 2, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(2, 1, 3, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(2, 1, 4, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(2, 1, 5, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(2, 1, 6, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(2, 1, 7, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(2, 1, 8, 2017, 150, 'Personal Care', 'personalcare.svg', 8),
(2, 1, 9, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(2, 1, 10, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(2, 1, 11, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(2, 1, 12, 2017, 40, 'Personal Care', 'personalcare.svg', 8),
(2, 1, 1, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(2, 1, 2, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(2, 1, 3, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(2, 1, 4, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(2, 1, 5, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(2, 1, 6, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(2, 1, 7, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(2, 1, 8, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(2, 1, 9, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(2, 1, 10, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(2, 1, 11, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9),
(2, 1, 12, 2017, 50, 'Cash (Other / Random)', 'emergencycash.svg', 9)
;

SELECT * FROM budget_flow_item;

SELECT item_year, item_month, SUM(item_amount)
FROM budget_flow_item
WHERE budget_id = 1
GROUP BY item_year, item_month
;

SELECT category_name, budget_template_category_id, item_month, item_year, item_name, item_amount, item_sort_sequence
FROM budget_template_category, budget_flow_item
WHERE budget_template_category.id = budget_flow_item.budget_template_category_id
AND budget_id = 1
ORDER BY budget_template_category_id, item_year, item_month, item_sort_sequence
;

CREATE TABLE budget_item (
    id serial PRIMARY KEY,
    budget_id INTEGER REFERENCES budget,
    budget_template_category_id INTEGER REFERENCES budget_template_category,
    item_name VARCHAR(30),
    item_img_src VARCHAR(30),
    item_amount integer,
    item_sort_sequence integer
);

INSERT INTO budget_item (budget_id, budget_template_category_id, item_name, item_img_src, item_amount, item_sort_sequence)
VALUES (1, 2, 'Steve', 'img30.jpg', 500, 1),
(1, 2, 'Ellen', 'img30.jpg', 500, 2),
(2, 2, 'Hien', 'img30.jpg', 300, 1),
(1, 4, 'Insurance', 'insurance.svg', 500, 1),
(1, 4, 'Investments', 'investments.svg', 300, 2),
(1, 4, 'Emergency Cash', 'emergencycash.svg', 300, 3),
(2, 4, 'Insurance', 'insurance.svg', 400, 1),
(2, 4, 'Investments', 'investments.svg', 1400, 2),
(1, 4, 'Emergency Cash', 'emergencycash.svg', 300, 3),
(1, 3, 'Rent | Mortgage', 'mortgage.svg', 1000, 1),
(1, 3, 'Daycare', 'daycare.svg', 700, 2),
(1, 3, 'Cars', 'cars.svg', 250, 3),
(1, 3, 'P&C Insurance','insurance.svg', 135, 4),
(1, 3, 'Cell Phone', 'cellphone.svg', 120, 5),
(1, 3, 'Utilities', 'utilities.svg', 200, 6),
(1, 3, 'Student Loans', 'studentloans.svg', 200, 7),
(1, 3, 'Credit Card | Loans', 'loans.svg', 100, 8),
(1, 3, 'Gas', 'gas.svg', 150, 9),
(2, 3,  'Groceries', 'groceries.svg', 450, 10),
(2, 3, 'Rent | Mortgage', 'mortgage.svg', 1000, 1),
(2, 3, 'Daycare', 'daycare.svg', 700, 2),
(2, 3, 'Cars', 'cars.svg', 250, 3),
(2, 3, 'P&C Insurance', 'insurance.svg', 135, 4),
(2, 3, 'Cell Phone', 'cellphone.svg', 120, 5),
(2, 3, 'Utilities', 'utilities.svg', 200, 6),
(2, 3, 'Student Loans', 'studentloans.svg', 200, 7),
(2, 3, 'Credit Card | Loans', 'loans.svg', 100, 8),
(2, 3, 'Gas', 'gas.svg', 150, 9),
(2, 3, 'Groceries', 'groceries.svg', 450, 10)
;

SELECT category_name, budget_template_category_id, item_name, item_amount, item_sort_sequence
FROM budget_template_category, budget_item
WHERE budget_template_category.id = budget_item.budget_template_category_id
AND budget_id = 1
ORDER BY budget_template_category_id, item_sort_sequence
;


DELETE FROM budget_flow_item WHERE budget_id > 2;
DELETE FROM budget_item WHERE budget_id > 2;
DELETE FROM budget WHERE id > 2;
DELETE FROM users WHERE id > 2;

--Query to get flex, financial, and functional items/amounts by budget_id
SELECT category_name, item_name, item_amount
FROM budget_item, budget_template_category
WHERE budget_template_category.id = budget_template_category_id
AND budget_id = 1
ORDER BY budget_template_category_id, item_sort_sequence
;

--Query to get flex, financial, and functional monthly total by budget_id and category_id
SELECT budget_template_category.category_name, SUM(item_amount) AS monthly_total
FROM budget_item, budget_template_category
WHERE budget_template_category.id = budget_template_category_id
AND budget_id = 1
GROUP BY budget_template_category.category_name
;

--Query to get flow items/amounts by name and budget_id
SELECT item_year, item_month, item_name, item_amount
FROM budget_flow_item
WHERE budget_id = 1
ORDER BY item_year, item_month, item_sort_sequence
;

--Query to get flow monthly total by item_year and item_month
SELECT item_year, item_month, SUM(item_amount) AS monthly_total
FROM budget_flow_item
WHERE budget_id = 1
GROUP BY item_year, item_month
;

--Query to get flow annual total by item_name
SELECT item_name, SUM(item_amount) AS annual_total
FROM budget_flow_item
WHERE budget_id = 1
GROUP BY item_name
;
