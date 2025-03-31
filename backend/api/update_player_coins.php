#!/usr/local/bin/php
<?php
// Enable full error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "db_config.php";

// CORS + JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(["error" => "Use POST request."]));
}

// Debug incoming POST data
if (!isset($_POST['PlayerID']) || !isset($_POST['Coins'])) {
    file_put_contents("debug_log.txt", "POST MISSING: " . json_encode($_POST));
    die(json_encode(["error" => "Missing PlayerID or Coins"]));
}

// Sanitize input
$PlayerID = intval($_POST['PlayerID']);
$Coins = intval($_POST['Coins']);

// Debug log
file_put_contents("debug_log.txt", "Received PlayerID=$PlayerID Coins=$Coins");

// Prepare statement
$stmt = $conn->prepare("UPDATE Player SET Coins = ? WHERE PlayerID = ?");
if (!$stmt) {
    die(json_encode(["error" => "Prepare failed: " . $conn->error]));
}

$stmt->bind_param("ii", $Coins, $PlayerID);

if (!$stmt->execute()) {
    die(json_encode(["error" => "Execute failed: " . $stmt->error]));
}

$stmt->close();
$conn->close();

echo json_encode(["success" => true]);
exit;
?>
