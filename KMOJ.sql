--Create master table:
CREATE TABLE master(
id SERIAL PRIMARY KEY,
users_id INT,
client_id INT,
sign_date TIMESTAMP NOT NULL,
event_name VARCHAR (100),
spot_number INT,
total_cost NUMERIC,
interviews INT,
socialmedia INT,
instructions VARCHAR (300),
man_app BOOLEAN DEFAULT 'false',
uw_app BOOLEAN DEFAULT 'false',
pr_app BOOLEAN DEFAULT 'false',
tr_app BOOLEAN DEFAULT 'false',
spot_type VARCHAR (3),
spot_length VARCHAR (5),
spot_rate NUMERIC,
total_spots INT,
flight_id INT,
prod_id INT,
copy_id INT
);


--CREATE clients table:

CREATE TABLE clients(
client_id SERIAL PRIMARY KEY,
name VARCHAR (50),
contact VARCHAR (50),
address VARCHAR (200),
city VARCHAR (50),
state VARCHAR (50),
zip INT,
phone VARCHAR (15),
cell VARCHAR (15),
fax VARCHAR (15),
email VARCHAR (50),
webiste VARCHAR (100),
users_id INT
);

--Create users table:
CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR (100),
permission INT,
name VARCHAR (100),
active BOOLEAN DEFAULT 'true'
);

--CREATE slots table:
CREATE TABLE slots (
id SERIAL PRIMARY KEY,
day_of_run INT,
plays INT,
slot VARCHAR (20),
flight_id INT
);

--CREATE table flight:
CREATE TABLE flight (
id SERIAL PRIMARY KEY,
contract_id INT,
start_date DATE NOT NULL,
end_date DATE NOT NULL,
cart_number VARCHAR (15)
);

--CREATE table production:
CREATE TABLE production (
id SERIAL PRIMARY KEY,
contract_id INT,
talent VARCHAR (100),
who VARCHAR (200),
what VARCHAR (500),
site VARCHAR (200),
why VARCHAR (500),
cart_number VARCHAR (15)
);


--ALTER tables to link id's with foreign keys:
ALTER TABLE master
ADD FOREIGN KEY (client_id) REFERENCES clients;

ALTER TABLE master
ADD FOREIGN KEY (flight_id) REFERENCES flight;

ALTER TABLE master
ADD FOREIGN KEY (prod_id) REFERENCES production;

ALTER TABLE flight
ADD FOREIGN KEY (contract_id) REFERENCES master;

ALTER TABLE production
ADD FOREIGN KEY (contract_id) REFERENCES master;

ALTER TABLE slots
ADD FOREIGN KEY (flight_id) REFERENCES flight;


ALTER TABLE production ADD COLUMN producer VARCHAR (50);

<<<<<<< HEAD
ALTER TABLE master ADD COLUMN discounts DECIMAL;

ALTER TABLE master ADD COLUMN commission INTEGER;

ALTER TABLE master DROP COLUMN commission;

ALTER TABLE master ADD COLUMN commission DECIMAL;
=======
ALTER TABLE production ADD COLUMN complete_date DATE;

ALTER TABLE master ALTER COLUMN sign_date SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE flight ALTER COLUMN start_date SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE flight ALTER COLUMN end_date SET DEFAULT CURRENT_TIMESTAMP;
>>>>>>> tablequeries
