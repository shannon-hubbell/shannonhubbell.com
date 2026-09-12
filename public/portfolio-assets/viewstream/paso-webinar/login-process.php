<?php
require_once 'pasodb.php';

if ($_POST) {
    $sql = "INSERT into paso_logins set email = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([trim(strtolower($_POST['login-email']))]);
    setcookie('paso_webinar', true, time() + 6000, '/');
    header('Location: stage');
}
