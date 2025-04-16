#!/usr/local/bin/php
<?php
// Enable errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// No shebang — keep it simple
require_once "db_config.php";

header("Content-Type: application/json");

// Confirm DB connection
if (!$conn || $conn->connect_error) {
    die(json_encode(["error" => "DB failed: " . $conn->connect_error]));
}

echo json_encode(["status" => " DB connection works"]);
?>
