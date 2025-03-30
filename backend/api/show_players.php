#!/usr/local/bin/php
<?php
// CORS headers must be sent before any output
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");
header("Content-Type: application/json");

// Optionally handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once "db_config.php";

$sql = "SELECT * FROM Player";
$result = $conn->query($sql);

$players = [];
while ($row = $result->fetch_assoc()) {
    $players[] = $row;
}

$conn->close();
echo json_encode($players);
exit;
?>
