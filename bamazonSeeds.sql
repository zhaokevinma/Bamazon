DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);
-- Insert rows into table 'TableName'
INSERT INTO products
( -- columns to insert data into
 product_name, department_name, price, stock_quantity
)
VALUES
( -- first row: values for the columns in the list above
 "iPhone", "Electronics", 999, 10
),
( -- second row: values for the columns in the list above
 "iPad", "Electronics", 1099, 5
),
-- add more rows here
(
 "Melatonin", "Drug", 59, 100   
),
(
 "T-shirt", "Clothing", 9.9, 100   
),
(
 "Shampoo", "Cosmetics", 19, 100   
),
(
 "Conditioner", "Cosmetics", 29, 100   
),
(
 "Desk", "Furniture", 199, 20   
),
(
 "Chair", "Furniture", 49, 40   
),
(
 "Backpack", "Necessity", 99, 100   
);
