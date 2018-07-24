DROP DATABASE IF EXISTS bamazon_db;

CREATE database bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INTEGER (11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    stock_quantity INTEGER (11) NOT NULL,
    PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES 
	("Laptop Computer", "Electronics", 1199.00, 3),
  ("Cell Phone", "Electronics", 299.00, 13),
  ("4K TV", "Electronics", 599.00, 10),
  ("Stuffed Animal", "Toys", 29.00, 5),
	("Toy Truck", "Toys", 49.00, 6),
  ("Chair", "Furniture", 99.00, 8),
  ("Desk", "Furniture", 149.99, 8),
  ("Lamp", "Furniture", 19.00, 12),
  ("Baseball Bat", "Sports", 179.00, 24),
  ("Baseball Glove", "Sports", 139.00, 10),
  ("Basketball", "Sports", 29.00, 12)