--Create master table:
CREATE TABLE master(
id SERIAL PRIMARY KEY,
users_id VARCHAR (30),
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

--Create clients table:
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
users_id VARCHAR (50)
);

--Create users table:
CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR (100),
permission INT,
name VARCHAR (100),
active BOOLEAN DEFAULT 'true'
);
