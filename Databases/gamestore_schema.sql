CREATE SCHEMA GAMESTORE;
USE GAMESTORE;

CREATE TABLE Users (
	id INT UNIQUE PRIMARY KEY,
	username VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(50) NOT NULL,
	email VARCHAR(100) UNIQUE,
	phone VARCHAR(20),
	total_points INT DEFAULT 0,
	subscription_status BOOLEAN DEFAULT false
);

CREATE TABLE Admins (
	id INT UNIQUE PRIMARY KEY,
	username VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(50) NOT NULL,
	email VARCHAR(100) NOT NULL
);

CREATE TABLE Games (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	game_name VARCHAR(50) NOT NULL,
	release_date DATE,
	developer VARCHAR(50),
	rating FLOAT(2,1) DEFAULT 0.0,
	price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
	genre ENUM('Action', 'Adventure', 'Role-playing', 'Simulation', 'Strategy', 'Sports', 'Rhythm', 'Other') DEFAULT 'Other',
	platform SET('PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile', 'VR', 'Other') DEFAULT 'Other',
	description TEXT,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	INDEX (genre),
	INDEX (platform)
);


CREATE TABLE QueueBookings (
	id INT PRIMARY KEY,
	customer_id INT NOT NULL,
	book_date DATE NOT NULL,
	queue_status ENUM('WAITING', 'DONE', 'DECLINE') DEFAULT 'WAITING',
	discount_applied DECIMAL(3,2) DEFAULT 0.00,
	FOREIGN KEY (customer_id) REFERENCES Users(id)
);

CREATE TABLE Rentals (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	customer_id INT NOT NULL,
	game_id INT UNSIGNED NOT NULL,
	rental_start_date DATE NOT NULL,
	rental_end_date DATE NOT NULL,
	FOREIGN KEY (customer_id) REFERENCES Users(id),
	FOREIGN KEY (game_id) REFERENCES Games(id)
);

CREATE TABLE RentalItems (
	rental_id INT UNSIGNED NOT NULL,
	game_id INT UNSIGNED NOT NULL,
	rental_start_date DATE NOT NULL,
	rental_end_date DATE NOT NULL,
	PRIMARY KEY (rental_id, game_id),
	FOREIGN KEY (rental_id) REFERENCES Rentals(id),
	FOREIGN KEY (game_id) REFERENCES Games(id)
);

CREATE TABLE Reviews (
	id INT PRIMARY KEY,
	customer_id INT NOT NULL,
	game_id INT UNSIGNED NOT NULL,
	rating DECIMAL(2,1) NOT NULL,
	review_text TEXT,
	timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	review_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
	FOREIGN KEY (customer_id) REFERENCES Users(id),
	FOREIGN KEY (game_id) REFERENCES Games(id)
);

CREATE TABLE Discounts (
	id INT PRIMARY KEY,
	discount_code VARCHAR(20) NOT NULL,
	discount_amount DECIMAL(3,2) NOT NULL,
	expiration_date DATE NOT NULL
);

CREATE TABLE Wishlists (
	id INT PRIMARY KEY,
	customer_id INT NOT NULL,
	game_id INT UNSIGNED NOT NULL,
	date_added DATE NOT NULL,
	FOREIGN KEY (customer_id) REFERENCES Users(id),
	FOREIGN KEY (game_id) REFERENCES Games(id)
);

CREATE TABLE Orders (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	customer_id INT NOT NULL,
	order_date DATE NOT NULL,
	order_status ENUM('PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PROCESSING',
	total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
	FOREIGN KEY (customer_id) REFERENCES Users(id)
);

CREATE TABLE OrderItems (
	order_id INT UNSIGNED NOT NULL,
	game_id INT UNSIGNED NOT NULL,
	quantity INT NOT NULL DEFAULT 1,
	price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (order_id, game_id),
	FOREIGN KEY (order_id) REFERENCES Orders(id),
	FOREIGN KEY (game_id) REFERENCES Games(id)
);

CREATE TABLE PaymentMethods (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	customer_id INT NOT NULL,
	payment_type ENUM('CREDIT CARD', 'DEBIT CARD', 'PAYPAL', 'OTHER') NOT NULL,
	card_number VARCHAR(20),
	cardholder_name VARCHAR(50),
	expiration_date DATE,
	FOREIGN KEY (customer_id) REFERENCES Users(id)
);

CREATE TABLE OrderPayments (
	order_id INT UNSIGNED NOT NULL,
	payment_method_id INT UNSIGNED NOT NULL,
	payment_status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PENDING',
	payment_date DATE,
    PRIMARY KEY(order_id, payment_method_id),
	FOREIGN KEY (order_id) REFERENCES Orders(id),
	FOREIGN KEY (payment_method_id) REFERENCES PaymentMethods(id)
);


