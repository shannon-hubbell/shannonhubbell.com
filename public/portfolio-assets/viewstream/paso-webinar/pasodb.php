<?php

$host = 'localhost:3306';
$db   = 'pasoregs';
$user = 'pasoregs';
$pass = '6wNSq4mxtu4o^1Adw';
$charset = 'utf8mb4';

// $host = '127.0.0.1';
// $db   = 'deloitte';
// $user = 'deloitte_si';
// $pass = 'hunter stove told sunlight';
// $charset = 'utf8mb4';


$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
     throw new PDOException($e->getMessage(), (int)$e->getCode());
}

?>
