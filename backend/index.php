<?php
require 'vendor/autoload.php';
require_once __DIR__ . '/rest/services/UserService.php';
require_once __DIR__ . '/rest/services/BookService.php';
require_once __DIR__ . '/rest/services/BorrowHistoryService.php';
require_once __DIR__ . '/rest/services/GenreService.php';
require_once __DIR__ . '/rest/services/ReviewService.php';
require_once __DIR__ . '/rest/services/AuthService.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';
require_once __DIR__ . '/data/Roles.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

Flight::register('userService', 'UserService');
Flight::register('bookService', 'BookService');
Flight::register('borrowHistoryService', 'BorrowHistoryService');
Flight::register('genreService', 'GenreService');
Flight::register('reviewService', 'ReviewService');
Flight::register('auth_service', 'AuthService');
Flight::register('auth_middleware', 'AuthMiddleware');

Flight::before('start', function() {
    $url = Flight::request()->url;
    $method = Flight::request()->method;
    
    if(strpos($url, '/auth/login') === 0 ||
       strpos($url, '/auth/register') === 0 ||
       strpos($url, '/public') === 0 || 
       (strpos($url, '/books') === 0 && $method === 'GET') ||  
       (strpos($url, '/reviews') === 0 && $method === 'GET') ||
       (strpos($url, '/genres') === 0 && $method === 'GET') ||
       (strpos($url, '/borrow') === 0 && $method === 'GET')
    ) {
        return TRUE;
    }
    
    $headers = getallheaders();
    $token = null;
    if (isset($headers['Authorization'])) {
        $token = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $token = $headers['authorization'];
    }
    
    error_log("Headers received: " . print_r($headers, true));
    error_log("Token extracted: " . $token);
    if ($token && strpos($token, 'Bearer ') === 0) {
        $token = substr($token, 7);
    }
    
    error_log("Token after Bearer removal: " . $token);
    try {
        Flight::auth_middleware()->verifyToken($token);
        
        $user = Flight::get('user');
        error_log("User set after verifyToken: " . json_encode($user));
        
    } catch (Exception $e) {
        error_log("Token verification failed: " . $e->getMessage());
        Flight::json(['error' => 'Invalid or expired token'], 401);
        Flight::stop();
        return false;
    }
});

require_once __DIR__ . '/rest/routes/UserRoutes.php';
require_once __DIR__ . '/rest/routes/BookRoutes.php';
require_once __DIR__ . '/rest/routes/BorrowHistoryRoutes.php';
require_once __DIR__ . '/rest/routes/GenreRoutes.php';
require_once __DIR__ . '/rest/routes/ReviewRoutes.php';
require_once __DIR__ . '/rest/routes/AuthRoutes.php';

// Start FlightPHP
Flight::start();