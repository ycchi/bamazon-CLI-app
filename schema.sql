DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
   item_id INTEGER(11) NOT NULL AUTO_INCREMENT,
   product_name VARCHAR(30) NOT NULL,
   department_name VARCHAR (30) NOT NULL,
   price DECIMAL(10, 2) NOT NULL,
   stock_quantity INTEGER(11),
   PRIMARY KEY (item_id)
);

-- seed data --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Spalding Basketball", "Sports", 20.99, 8),
("Patagonia T-shirt", "Clothing", 23.00, 23),
("Brio Motorized Toy Train", "Toys", 8.50, 12),
("HP Laser Printer", "Electronics", 98.00, 6),
("Dell 27in 4K monitor", "Electronics", 450.00, 7),
("Apple Watch 40mm 2nd Gen", "Electronics", 250.00, 6),
("Herman Miller Chair", "Furnitures", 575.00, 3),
("Pistachio", "Groceries", 8.00, 30),
("Oreo", "Groceries", 4.50, 21),
("North Face Hoodie", "Clothing", 35.00, 14);
