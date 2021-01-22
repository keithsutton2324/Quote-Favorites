/*

To run this file, we do the following in our Terminal:

1. Go to the directory of this sql file.

2. Get into our mysql console.

3. Run "source schema.sql"

*/

-- Drops the quote_favorites_db if it already exists --
DROP DATABASE IF EXISTS quote_favorites_db;

-- Create the database quote_favorites_db and specified it for use.
CREATE DATABASE quote_favorites_db;

USE quote_favorites_db;

-- Create the table plans.
CREATE TABLE quotefavorites (
  id int NOT NULL AUTO_INCREMENT,
  quote varchar(255) NOT NULL,
  PRIMARY KEY (id)
);
