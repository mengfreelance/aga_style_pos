-- StylePOS Seed Data
-- Run after database/schema.sql
USE stylepos_db;

-- Default admin user (password: password)
INSERT INTO users (username, email, password, name, role) VALUES
('admin', 'admin@stylepos.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Admin', 'admin');

-- Clothing Categories
INSERT INTO categories (name) VALUES
('T-Shirts'), ('Polo Shirts'), ('Hoodies & Sweatshirts'), ('Jackets & Coats'), ('Jeans & Trousers'), ('Dresses'), ('Skirts'), ('Activewear'), ('Undergarments'), ('Accessories');

-- Clothing Brands
INSERT INTO brands (name) VALUES
('Nike'), ('Adidas'), ('Zara'), ('H&M'), ('Uniqlo'), ('Levi\'s'), ('Gucci'), ('Prada'), ('Chanel'), ('Louis Vuitton');

-- Clothing Products
INSERT INTO products (category_id, brand_id, name, description, cost_price) VALUES
(1, 1, 'Nike Dri-FIT Cotton T-Shirt', 'Athletic cotton blend t-shirt for everyday wear', 12.00),
(1, 4, 'H&M Classic Fit Cotton T-Shirt', 'Classic fit cotton t-shirt with crew neck', 8.00),
(1, 5, 'Uniqlo Supima Cotton T-Shirt', 'Premium supima cotton t-shirt, soft and breathable', 15.00),
(2, 2, 'Adidas Performance Polo', 'Moisture-wicking polo shirt for sports and casual', 18.00),
(2, 3, 'Zara Slim Fit Polo Shirt', 'Slim fit polo shirt with contrasting collar', 22.00),
(3, 1, 'Nike Sportswear Hoodie', 'Fleece hoodie with kangaroo pocket and drawstring hood', 35.00),
(3, 4, 'H&M Oversized Hoodie', 'Oversized hooded sweatshirt with graphic print', 28.00),
(4, 7, 'Gucci Leather Bomber Jacket', 'Premium leather bomber jacket with ribbed cuffs', 450.00),
(4, 8, 'Prada Wool Blend Coat', 'Elegant wool blend coat with double-breasted closure', 520.00),
(5, 6, 'Levi\'s 501 Original Fit Jeans', 'Classic straight-fit denim jeans with button fly', 45.00),
(5, 1, 'Nike Tech Fleece Joggers', 'Lightweight tech fleece joggers with tapered fit', 32.00),
(6, 9, 'Chanel Little Black Dress', 'Timeless little black dress for evening occasions', 380.00),
(6, 3, 'Zara Floral Print Maxi Dress', 'Flowing maxi dress with floral print and v-neckline', 45.00),
(7, 5, 'Uniqlo Denim Mini Skirt', 'High-waisted denim mini skirt with button closure', 25.00),
(7, 4, 'H&M Pleated Skirt', 'Pleated midi skirt with elastic waistband', 20.00),
(8, 2, 'Adidas Training Leggings', 'High-waisted training leggings with moisture-wicking fabric', 25.00),
(8, 1, 'Nike Pro Dri-FIT Shorts', 'Compression shorts for intense workouts', 20.00),
(9, 5, 'Uniqlo Airism Briefs', 'Breathable Airism underwear briefs, 3-pack', 15.00),
(9, 4, 'H&M Cotton Socks', 'Soft cotton ankle socks, 5-pack', 8.00),
(10, 3, 'Zara Leather Belt', 'Genuine leather belt with silver buckle', 18.00),
(10, 7, 'Gucci Silk Scarf', 'Luxury silk scarf with iconic print', 85.00);

-- Product Variants (T-Shirts, Polos, Hoodies, etc.)
INSERT INTO product_variants (product_id, sku, size, color, selling_price, stock_quantity) VALUES
-- Nike Dri-FIT Cotton T-Shirt (id=1)
(1, 'NK-DRIFIT-S-WHT', 'S', 'White', 25.00, 100),
(1, 'NK-DRIFIT-M-WHT', 'M', 'White', 25.00, 120),
(1, 'NK-DRIFIT-L-WHT', 'L', 'White', 25.00, 110),
(1, 'NK-DRIFIT-S-BLK', 'S', 'Black', 25.00, 90),
(1, 'NK-DRIFIT-M-BLK', 'M', 'Black', 25.00, 100),
(1, 'NK-DRIFIT-L-BLK', 'L', 'Black', 25.00, 95),

-- H&M Classic Fit Cotton T-Shirt (id=2)
(2, 'HM-CLASSIC-S-GRY', 'S', 'Gray', 16.00, 80),
(2, 'HM-CLASSIC-M-GRY', 'M', 'Gray', 16.00, 85),
(2, 'HM-CLASSIC-L-GRY', 'L', 'Gray', 16.00, 75),
(2, 'HM-CLASSIC-S-NVY', 'S', 'Navy', 16.00, 70),
(2, 'HM-CLASSIC-M-NVY', 'M', 'Navy', 16.00, 80),

-- Uniqlo Supima Cotton T-Shirt (id=3)
(3, 'UNQ-SUPIMA-M-WHT', 'M', 'White', 29.00, 60),
(3, 'UNQ-SUPIMA-L-WHT', 'L', 'White', 29.00, 55),
(3, 'UNQ-SUPIMA-M-BLK', 'M', 'Black', 29.00, 50),
(3, 'UNQ-SUPIMA-L-BLK', 'L', 'Black', 29.00, 45),

-- Adidas Performance Polo (id=4)
(4, 'AD-PERF-S-RED', 'S', 'Red', 35.00, 40),
(4, 'AD-PERF-M-RED', 'M', 'Red', 35.00, 45),
(4, 'AD-PERF-L-RED', 'L', 'Red', 35.00, 35),
(4, 'AD-PERF-M-BLU', 'M', 'Blue', 35.00, 50),

-- Zara Slim Fit Polo Shirt (id=5)
(5, 'ZA-SLIM-M-WHT', 'M', 'White', 42.00, 30),
(5, 'ZA-SLIM-L-WHT', 'L', 'White', 42.00, 25),
(5, 'ZA-SLIM-M-BLK', 'M', 'Black', 42.00, 35),

-- Nike Sportswear Hoodie (id=6)
(6, 'NK-HOODIE-M-GRY', 'M', 'Gray', 65.00, 40),
(6, 'NK-HOODIE-L-GRY', 'L', 'Gray', 65.00, 35),
(6, 'NK-HOODIE-M-BLK', 'M', 'Black', 65.00, 30),
(6, 'NK-HOODIE-L-BLK', 'L', 'Black', 65.00, 25),

-- H&M Oversized Hoodie (id=7)
(7, 'HM-OVERSIZED-M-BLK', 'M', 'Black', 52.00, 30),
(7, 'HM-OVERSIZED-L-BLK', 'L', 'Black', 52.00, 25),
(7, 'HM-OVERSIZED-M-WHT', 'M', 'White', 52.00, 20),

-- Gucci Leather Bomber Jacket (id=8)
(8, 'GUCCI-BOMBER-46-BRN', '46', 'Brown', 890.00, 5),
(8, 'GUCCI-BOMBER-48-BRN', '48', 'Brown', 890.00, 3),
(8, 'GUCCI-BOMBER-46-BLK', '46', 'Black', 890.00, 4),

-- Prada Wool Blend Coat (id=9)
(9, 'PRADA-COAT-40-BLK', '40', 'Black', 950.00, 3),
(9, 'PRADA-COAT-42-BLK', '42', 'Black', 950.00, 2),
(9, 'PRADA-COAT-40-GRY', '40', 'Gray', 950.00, 2),

-- Levi's 501 Original Fit Jeans (id=10)
(10, 'LEVI501-30-BLU', '30', 'Blue', 85.00, 25),
(10, 'LEVI501-32-BLU', '32', 'Blue', 85.00, 30),
(10, 'LEVI501-34-BLU', '34', 'Blue', 85.00, 28),
(10, 'LEVI501-36-BLU', '36', 'Blue', 85.00, 20),
(10, 'LEVI501-32-BLK', '32', 'Black', 85.00, 15),

-- Nike Tech Fleece Joggers (id=11)
(11, 'NK-TECHJOG-M-BLK', 'M', 'Black', 58.00, 30),
(11, 'NK-TECHJOG-L-BLK', 'L', 'Black', 58.00, 25),
(11, 'NK-TECHJOG-M-GRY', 'M', 'Gray', 58.00, 20),

-- Chanel Little Black Dress (id=12)
(12, 'CHANEL-LBD-36-BLK', '36', 'Black', 720.00, 2),
(12, 'CHANEL-LBD-38-BLK', '38', 'Black', 720.00, 1),

-- Zara Floral Print Maxi Dress (id=13)
(13, 'ZA-MAXI-S-FLR', 'S', 'Floral', 85.00, 15),
(13, 'ZA-MAXI-M-FLR', 'M', 'Floral', 85.00, 18),
(13, 'ZA-MAXI-L-FLR', 'L', 'Floral', 85.00, 12),

-- Uniqlo Denim Mini Skirt (id=14)
(14, 'UNQ-DENIM-S-BLU', 'S', 'Blue', 45.00, 20),
(14, 'UNQ-DENIM-M-BLU', 'M', 'Blue', 45.00, 22),
(14, 'UNQ-DENIM-L-BLU', 'L', 'Blue', 45.00, 18),

-- H&M Pleated Skirt (id=15)
(15, 'HM-PLEATED-S-BLK', 'S', 'Black', 38.00, 25),
(15, 'HM-PLEATED-M-BLK', 'M', 'Black', 38.00, 20),
(15, 'HM-PLEATED-L-BLK', 'L', 'Black', 38.00, 15),

-- Adidas Training Leggings (id=16)
(16, 'AD-LEGGINGS-S-BLK', 'S', 'Black', 45.00, 30),
(16, 'AD-LEGGINGS-M-BLK', 'M', 'Black', 45.00, 35),
(16, 'AD-LEGGINGS-L-BLK', 'L', 'Black', 45.00, 25),
(16, 'AD-LEGGINGS-M-BLU', 'M', 'Blue', 45.00, 20),

-- Nike Pro Dri-FIT Shorts (id=17)
(17, 'NK-PROSHORT-M-BLK', 'M', 'Black', 38.00, 30),
(17, 'NK-PROSHORT-L-BLK', 'L', 'Black', 38.00, 25),
(17, 'NK-PROSHORT-M-GRY', 'M', 'Gray', 38.00, 20),

-- Uniqlo Airism Briefs (id=18)
(18, 'UNQ-AIRISM-M-WHT', 'M', 'White', 28.00, 50),
(18, 'UNQ-AIRISM-L-WHT', 'L', 'White', 28.00, 45),
(18, 'UNQ-AIRISM-M-BLK', 'M', 'Black', 28.00, 40),
(18, 'UNQ-AIRISM-L-BLK', 'L', 'Black', 28.00, 35),

-- H&M Cotton Socks (id=19)
(19, 'HM-SOCKS-ONE-WHT', 'One Size', 'White', 12.00, 100),
(19, 'HM-SOCKS-ONE-BLK', 'One Size', 'Black', 12.00, 95),

-- Zara Leather Belt (id=20)
(20, 'ZA-BELT-ONE-BRN', 'One Size', 'Brown', 35.00, 40),
(20, 'ZA-BELT-ONE-BLK', 'One Size', 'Black', 35.00, 35),

-- Gucci Silk Scarf (id=21)
(21, 'GUCCI-SCARF-ONE-RED', 'One Size', 'Red', 160.00, 8),
(21, 'GUCCI-SCARF-ONE-BLU', 'One Size', 'Blue', 160.00, 6);

-- Customers
INSERT INTO customers (name, phone, email, address) VALUES
('John Doe', '012345678', 'john@example.com', '123 Street, Phnom Penh'),
('Jane Smith', '098765432', 'jane@example.com', '456 Road, Siem Reap'),
('Michael Chen', '098123456', 'michael@example.com', '789 Avenue, Battambang'),
('Sarah Johnson', '088765432', 'sarah@example.com', '321 Road, Kampot');
