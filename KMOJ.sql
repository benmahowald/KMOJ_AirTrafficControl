--Create master table:
CREATE TABLE master(
id SERIAL PRIMARY KEY,
uw_user_id VARCHAR (30),
client_id VARCHAR (30),
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
flight_id VARCHAR (30),
prod_id VARCHAR (30),
copy_id VARCHAR (30)
);

--CREATE clients table:
CREATE TABLE clients(
id SERIAL PRIMARY KEY,
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
uw_user_id VARCHAR (50)
);

--Create users table:
CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR (100),
permission BOOLEAN DEFAULT 'false',
name VARCHAR (100),
active BOOLEAN DEFAULT 'false'
);

--CREATE slots table:
CREATE TABLE slots (
id SERIAL PRIMARY KEY,
day_of_run INT,
plays INT,
slot VARCHAR (20),
flight_id VARCHAR (300)
);

--CREATE table flight:
CREATE TABLE flight (
id SERIAL PRIMARY KEY,
contract_id VARCHAR (300),
start_date DATE NOT NULL,
end_date DATE NOT NULL,
cart_number VARCHAR (15)
);

--CREATE table production:
CREATE TABLE production (
id SERIAL PRIMARY KEY,
contract_id VARCHAR (300),
talent VARCHAR (100),
who VARCHAR (200),
what VARCHAR (500),
site VARCHAR (200),
why VARCHAR (500),
cart_number VARCHAR (15)
);
