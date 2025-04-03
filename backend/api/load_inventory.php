#!/usr/local/bin/php
<?php
require_once "db_config.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit(); }

$playerID = $_GET['PlayerID'] ?? null;
if (!$playerID) { die(json_encode(["error" => "Missing PlayerID"])); }

$sql = "SELECT PlantID, CritterID, HappinessLevel FROM PlayerInventory WHERE PlayerID = " . intval($playerID);
$result = $conn->query($sql);

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

echo json_encode($items);
$conn->close();
exit;
?>
