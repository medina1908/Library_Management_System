<?php
error_reporting(0);
ini_set('display_errors', 0);

require __DIR__ . '/../../../vendor/autoload.php';

define('LOCALSERVER', 'http://localhost/Library_Management_System/backend');
define('PRODSERVER', 'https://library-backend-app-d9fng.ondigitalocean.app/');

\OpenApi\Logger::getInstance()->log = function() {};

$openapi = \OpenApi\Generator::scan([
    __DIR__ . '/doc_setup.php',
    __DIR__ . '/../../../rest/routes'
]);

header('Content-Type: application/json');
echo $openapi->toJson();
?>