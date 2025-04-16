#!/usr/local/bin/php

<?php
ob_start(); //  Start buffering

require_once "db_config.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit(); }

$playerID = $_GET['PlayerID'] ?? null;
if (!$playerID) {
    ob_clean();
    echo json_encode(["error" => "Missing PlayerID"]);
    exit();
}

file_put_contents("load_inventory_log.txt", json_encode([
    "timestamp" => date("Y-m-d H:i:s"),
    "PlayerID" => $playerID,
    "action" => "load_request"
], JSON_PRETTY_PRINT) . "\n\n", FILE_APPEND);

$sql = "SELECT ItemName, Quantity FROM Inventory WHERE PlayerID = " . intval($playerID);
$result = $conn->query($sql);

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

file_put_contents("load_inventory_log.txt", json_encode([
    "timestamp" => date("Y-m-d H:i:s"),
    "PlayerID" => $playerID,
    "action" => "load_result",
    "ReturnedInventory" => $items
], JSON_PRETTY_PRINT) . "\n\n", FILE_APPEND);

ob_clean(); //  Clean shebang before output
echo json_encode($items);
$conn->close();
exit;
?>
