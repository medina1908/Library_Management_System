<?php
require_once 'dao/UserDao.php';
require_once 'dao/GenreDao.php';
require_once 'dao/BookDao.php';
require_once 'dao/ReviewDao.php';
require_once 'dao/BorrowHistoryDao.php';

$userDao = new UserDao();
$genreDao = new GenreDao();
$bookDao = new BookDao();
$reviewDao = new ReviewDao();
$borrowHistoryDao = new BorrowHistoryDao();

/*$userDao->insert([
    'name' => 'Amina Bilalovic',
    'email' => 'amina.bilalovic@stu.ibu.edu.ba',
    'password' => password_hash('adna123',PASSWORD_DEFAULT),
    'role' => 'Student',
]);
$genreDao->insert([
    'name' => 'Technology',
    'description' => 'IT and programming books',
    'display_order' => 4
]);
$genreDao->insert([
    'name' => 'Science',
    'description' => 'Scientific books',
    'display_order' => 2
]);

$bookDao->insert([
    'genre_id' => 1,
    'title' => 'The Great Gatsby',
    'author' => 'F. Scott Fitzgerald',
    'isbn' => '978-0743276565',
    'publication_year' => 1925,
    'available_quantity' => 5
]);

$reviewDao->insert([
    'user_id' => 1,
    'book_id' => 1,
    'rating' => 5,
    'review_text' => 'Amazing book! Highly recommend it.',
    'created_at' => date('Y-m-d H:i:s')
]);


$borrowHistoryDao->insert([
    'user_id' => 3,
    'book_id' => 2,
    'borrow_date' => '2024-10-20',
    'due_date' => '2024-11-03',
    'return_date' => null,
    'status' => 'Active',
    'created_at' => date('Y-m-d H:i:s')
]);

**/

$users = $userDao->getAll();
print_r($users);

$genres = $genreDao->getAll();
print_r($genres);

$books = $bookDao->getAll();
print_r($books);

$reviews = $reviewDao->getAll();
print_r($reviews);

$borrows = $borrowHistoryDao->getAll();
print_r($borrows);

?>