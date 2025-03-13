#!/usr/local/bin/php 
<?php
require_once "db_config.php";

header("Access-Control-Allow-Origin: *"); // Allow all origins (replace * with a specific domain if needed)
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");

header("Content-Type: application/json");

// Handle OPTIONS request for preflight (important for CORS in some cases)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Ensure only POST requests are accepted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode(["error" => "Invalid request method. Use POST."]));
}

// Validate input
if (!isset($_POST['FirstName']) || !isset($_POST['LastName']) || !isset($_POST['Age'])) {
    die(json_encode(["error" => "Missing required fields"]));
}

// Sanitize input
$FirstName = htmlspecialchars(trim($_POST['FirstName']));
$LastName = htmlspecialchars(trim($_POST['LastName']));
$Age = intval($_POST['Age']);

// Ensure valid input
if ($Age <= 0 || empty($FirstName) || empty($LastName)) {
    die(json_encode(["error" => "Invalid input values"]));
}

// Prepare and execute the query
$stmt = $conn->prepare("INSERT INTO Persons (FirstName, LastName, Age) VALUES (?, ?, ?)");
if (!$stmt) {
    die(json_encode(["error" => "Prepare failed: " . $conn->error]));
}

$stmt->bind_param("ssi", $FirstName, $LastName, $Age);
if (!$stmt->execute()) {
    die(json_encode(["error" => "Execute failed: " . $stmt->error]));
}

// Close connections
$stmt->close();
$conn->close();

// Send a success response
echo json_encode(["success" => "Person added successfully"]);
exit;
?>
