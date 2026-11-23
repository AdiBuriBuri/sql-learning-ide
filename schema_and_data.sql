-- ====================================================================
-- Part 1: User Creation & Privilege Management (DCL)
-- Execute as SYSTEM or SYSDBA
-- ====================================================================

-- 1. Create a new user
CREATE USER store_user IDENTIFIED BY "1234";

-- 2. Grant Connection and Basic Resource privileges
GRANT CONNECT, RESOURCE TO store_user;

-- 3. Grant Storage Quota (essential in Oracle for creating tables)
GRANT UNLIMITED TABLESPACE TO store_user;

-- 4. Grant explicit DDL and Session privileges
GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW, CREATE SEQUENCE TO store_user;

-- Connect to the new user schema:
-- CONNECT store_user/1234@//localhost:1521/FREEPDB1;


-- ====================================================================
-- Part 2: Table Creation (DDL)
-- ====================================================================

-- 1. COMPANY Table
CREATE TABLE COMPANY (
    Company_ID NUMBER(10) PRIMARY KEY,
    Company_Name VARCHAR2(100) NOT NULL,
    City VARCHAR2(50),
    Contact_Number VARCHAR2(20)
);

-- 2. CUSTOMER Table
CREATE TABLE CUSTOMER (
    Customer_ID NUMBER(10) PRIMARY KEY,
    Customer_Name VARCHAR2(100) NOT NULL,
    Email VARCHAR2(100) UNIQUE,
    City VARCHAR2(50),
    Phone VARCHAR2(20)
);

-- 3. PRODUCT Table
CREATE TABLE PRODUCT (
    Product_ID NUMBER(10) PRIMARY KEY,
    Product_Name VARCHAR2(100) NOT NULL,
    Price NUMBER(10, 2) NOT NULL CHECK (Price >= 0),
    Company_ID NUMBER(10),
    CONSTRAINT fk_product_company FOREIGN KEY (Company_ID) 
        REFERENCES COMPANY(Company_ID) ON DELETE CASCADE
);

-- 4. ORDERS Table
CREATE TABLE ORDERS (
    Order_ID NUMBER(10) PRIMARY KEY,
    Customer_ID NUMBER(10),
    Order_Date DATE DEFAULT SYSDATE,
    Status VARCHAR2(30) DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    CONSTRAINT fk_orders_customer FOREIGN KEY (Customer_ID) 
        REFERENCES CUSTOMER(Customer_ID) ON DELETE CASCADE
);

-- 5. ORDER_ITEM Table
CREATE TABLE ORDER_ITEM (
    Order_Item_ID NUMBER(10) PRIMARY KEY,
    Order_ID NUMBER(10),
    Product_ID NUMBER(10),
    Quantity NUMBER(5) NOT NULL CHECK (Quantity > 0),
    Sale_Price NUMBER(10, 2) NOT NULL CHECK (Sale_Price >= 0),
    CONSTRAINT fk_item_order FOREIGN KEY (Order_ID) 
        REFERENCES ORDERS(Order_ID) ON DELETE CASCADE,
    CONSTRAINT fk_item_product FOREIGN KEY (Product_ID) 
        REFERENCES PRODUCT(Product_ID)
);


-- ====================================================================
-- Part 3: Data Insertion (DML)
-- ====================================================================

-- Insert into COMPANY
INSERT INTO COMPANY (Company_ID, Company_Name, City, Contact_Number) VALUES (101, 'Apple India', 'Bangalore', '+91-9876543210');
INSERT INTO COMPANY (Company_ID, Company_Name, City, Contact_Number) VALUES (102, 'Samsung Electronics', 'Noida', '+91-9876543211');
INSERT INTO COMPANY (Company_ID, Company_Name, City, Contact_Number) VALUES (103, 'Sony India', 'Mumbai', '+91-9876543212');
INSERT INTO COMPANY (Company_ID, Company_Name, City, Contact_Number) VALUES (104, 'Dell Technologies', 'Hyderabad', '+91-9876543213');
INSERT INTO COMPANY (Company_ID, Company_Name, City, Contact_Number) VALUES (105, 'Boat Lifestyle', 'Delhi', '+91-9876543214');

-- Insert into CUSTOMER
INSERT INTO CUSTOMER (Customer_ID, Customer_Name, Email, City, Phone) VALUES (1, 'Aarav Sharma', 'aarav.sharma@gmail.com', 'Dehradun', '9811122233');
INSERT INTO CUSTOMER (Customer_ID, Customer_Name, Email, City, Phone) VALUES (2, 'Priya Patel', 'priya.patel@yahoo.com', 'Mumbai', '9822233344');
INSERT INTO CUSTOMER (Customer_ID, Customer_Name, Email, City, Phone) VALUES (3, 'Rohan Mehta', 'rohan.mehta@outlook.com', 'Delhi', '9833344455');
INSERT INTO CUSTOMER (Customer_ID, Customer_Name, Email, City, Phone) VALUES (4, 'Ananya Verma', 'ananya.v@gmail.com', 'Bangalore', '9844455566');
INSERT INTO CUSTOMER (Customer_ID, Customer_Name, Email, City, Phone) VALUES (5, 'Vikram Singh', 'vikram.singh@gmail.com', 'Jaipur', '9855566677');

-- Insert into PRODUCT
INSERT INTO PRODUCT (Product_ID, Product_Name, Price, Company_ID) VALUES (201, 'iPhone 15', 79999.00, 101);
INSERT INTO PRODUCT (Product_ID, Product_Name, Price, Company_ID) VALUES (202, 'Galaxy S24', 74999.00, 102);
INSERT INTO PRODUCT (Product_ID, Product_Name, Price, Company_ID) VALUES (203, 'Bravia 55-inch 4K TV', 64999.00, 103);
INSERT INTO PRODUCT (Product_ID, Product_Name, Price, Company_ID) VALUES (204, 'XPS 15 Laptop', 124999.00, 104);
INSERT INTO PRODUCT (Product_ID, Product_Name, Price, Company_ID) VALUES (205, 'Airdopes 441', 1999.00, 105);

-- Insert into ORDERS
INSERT INTO ORDERS (Order_ID, Customer_ID, Order_Date, Status) VALUES (1001, 1, TO_DATE('2026-11-01', 'YYYY-MM-DD'), 'Delivered');
INSERT INTO ORDERS (Order_ID, Customer_ID, Order_Date, Status) VALUES (1002, 2, TO_DATE('2026-11-05', 'YYYY-MM-DD'), 'Shipped');
INSERT INTO ORDERS (Order_ID, Customer_ID, Order_Date, Status) VALUES (1003, 3, TO_DATE('2026-11-10', 'YYYY-MM-DD'), 'Processing');
INSERT INTO ORDERS (Order_ID, Customer_ID, Order_Date, Status) VALUES (1004, 1, TO_DATE('2026-11-15', 'YYYY-MM-DD'), 'Pending');
INSERT INTO ORDERS (Order_ID, Customer_ID, Order_Date, Status) VALUES (1005, 4, TO_DATE('2026-11-18', 'YYYY-MM-DD'), 'Delivered');

-- Insert into ORDER_ITEM
INSERT INTO ORDER_ITEM (Order_Item_ID, Order_ID, Product_ID, Quantity, Sale_Price) VALUES (5001, 1001, 201, 1, 79999.00);
INSERT INTO ORDER_ITEM (Order_Item_ID, Order_ID, Product_ID, Quantity, Sale_Price) VALUES (5002, 1001, 205, 2, 1999.00);
INSERT INTO ORDER_ITEM (Order_Item_ID, Order_ID, Product_ID, Quantity, Sale_Price) VALUES (5003, 1002, 202, 1, 74999.00);
INSERT INTO ORDER_ITEM (Order_Item_ID, Order_ID, Product_ID, Quantity, Sale_Price) VALUES (5004, 1003, 204, 1, 124999.00);
INSERT INTO ORDER_ITEM (Order_Item_ID, Order_ID, Product_ID, Quantity, Sale_Price) VALUES (5005, 1004, 205, 1, 1999.00);
INSERT INTO ORDER_ITEM (Order_Item_ID, Order_ID, Product_ID, Quantity, Sale_Price) VALUES (5006, 1005, 203, 1, 64999.00);
INSERT INTO ORDER_ITEM (Order_Item_ID, Order_ID, Product_ID, Quantity, Sale_Price) VALUES (5007, 1005, 201, 1, 78999.00);

COMMIT;

-- ====================================================================
-- Part 4: Table-Level Grants (DCL)
-- Granting object privileges on tables to user ADI
-- ====================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON COMPANY TO adi;
GRANT SELECT, INSERT, UPDATE, DELETE ON CUSTOMER TO adi;
GRANT SELECT, INSERT, UPDATE, DELETE ON PRODUCT TO adi;
GRANT SELECT, INSERT, UPDATE, DELETE ON ORDERS TO adi;
GRANT SELECT, INSERT, UPDATE, DELETE ON ORDER_ITEM TO adi;
