use `library_management_system`;

create table users(
	id int primary key AUTO_INCREMENT,
	name varchar(100) not null,
	email varchar(100) not null unique ,
	password varchar(300) not null,
	role ENUM('Admin', 'Student', 'Librarian') NOT null,
	status enum('Active', 'Nonactive') DEFAULT 'Active',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


create table genres(
	id int primary key AUTO_INCREMENT,
	name varchar(100) not null,
	description text,
	display_order int)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



create table books(
	id int primary key AUTO_INCREMENT,
	genre_id int,
	title varchar(255) not null,
	author varchar(255) not null,
	isbn varchar(50) UNIQUE,
	publication_year year,
	available_quantity int,
	foreign key (genre_id) references genres(id)
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

create table reviews(
	id int primary key AUTO_INCREMENT,
	user_id int not null,
	book_id int not null,
	rating INT CHECK (rating >= 1 AND rating <= 5),
	review_text TEXT,
	created_at TIMESTAMP,
	foreign key (user_id) references users(id),
	foreign key (book_id) references books(id)
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

create table borrow_history(
	id int primary key AUTO_INCREMENT,
	user_id int not null,
	book_id int not null,
	borrow_date date NOT NULL,
	due_date date NOT NULL,
	return_date date,
	status ENUM('BORROWED', 'RETURNED', 'OVERDUE') DEFAULT 'BORROWED',
	created_at TIMESTAMP,
	foreign key (user_id) references users(id),
	foreign key (book_id) references books(id)
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
