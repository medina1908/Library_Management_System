<?php
require 'vendor/autoload.php'; //run autoloader

require_once __DIR__ . '/rest/services/UserService.php';
require_once __DIR__ . '/rest/services/BookService.php';
require_once __DIR__ . '/rest/services/BorrowHistoryService.php';
require_once __DIR__ . '/rest/services/GenreService.php';
require_once __DIR__ . '/rest/services/ReviewService.php';

Flight::register('userService', 'UserService');
Flight::register('bookService', 'BookService');
Flight::register('borrowHistoryService', 'BorrowHistoryService');
Flight::register('genreService', 'GenreService');
Flight::register('reviewService', 'ReviewService');

Flight::route('/', function(){  //define route and define function to handle request
   echo 'Web is hard!';
});

require_once __DIR__ . '/rest/routes/UserRoutes.php';
require_once __DIR__ . '/rest/routes/BookRoutes.php';
require_once __DIR__ . '/rest/routes/BorrowHistoryRoutes.php';
require_once __DIR__ . '/rest/routes/GenreRoutes.php';
require_once __DIR__ . '/rest/routes/ReviewRoutes.php';


Flight::start();  //start FlightPHP
?>
