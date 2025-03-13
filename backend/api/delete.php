#!/usr/local/bin/php
<?php
require_once "db_config.php";

header("Access-Control-Allow-Origin: *"); // Allow all origins (replace * with specific domain if needed)
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");

header("Content-Type: application/json");

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle OPTIONS request for preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Check if Personid is provided
if (!isset($_GET['Personid'])) {
    die(json_encode(["error" => "Missing Personid parameter"]));
}

// Sanitize input
$Personid = intval($_GET['Personid']);
if ($Personid <= 0) {
    die(json_encode(["error" => "Invalid Personid"]));
}


// Prepare delete statement
$stmt = $conn->prepare("DELETE FROM Persons WHERE Personid = ?");
if (!$stmt) {
    die(json_encode(["error" => "Prepare failed: " . $conn->error]));
}

$stmt->bind_param("i", $Personid);
if (!$stmt->execute()) {
    die(json_encode(["error" => "Execute failed: " . $stmt->error]));
}

// Check if any row was affected
if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => "Person deleted successfully"]);
} else {
    echo json_encode(["error" => "Personid not found or already deleted"]);
}

$stmt->close();
$conn->close();
exit;
?>
