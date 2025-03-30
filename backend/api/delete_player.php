#!/usr/local/bin/php
<?php
require_once "db_config.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if (!isset($_GET['PlayerID'])) {
    die(json_encode(["error" => "Missing PlayerID parameter"]));
}

$PlayerID = intval($_GET['PlayerID']);
if ($PlayerID <= 0) {
    die(json_encode(["error" => "Invalid PlayerID"]));
}

$stmt = $conn->prepare("DELETE FROM Player WHERE PlayerID = ?");
if (!$stmt) {
    die(json_encode(["error" => "Prepare failed: " . $conn->error]));
}
$stmt->bind_param("i", $PlayerID);
if (!$stmt->execute()) {
    die(json_encode(["error" => "Execute failed: " . $stmt->error]));
}

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => "Player deleted successfully"]);
} else {
    echo json_encode(["error" => "Player not found or already deleted"]);
}

$stmt->close();
$conn->close();
exit;
?>
