#!/usr/local/bin/php

<?php
ob_start(); // Start buffering

require_once "db_config.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_clean();
    echo json_encode(["error" => "Invalid request method. Use POST."]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$playerID = $input["PlayerID"] ?? null;
$inventory = $input["Inventory"] ?? [];

$logData = [
    "timestamp" => date("Y-m-d H:i:s"),
    "PlayerID" => $playerID,
    "Inventory" => $inventory
];
file_put_contents("save_inventory_log.txt", json_encode($logData, JSON_PRETTY_PRINT) . "\n\n", FILE_APPEND);

if (!$playerID || !is_array($inventory)) {
    ob_clean();
    echo json_encode(["error" => "Invalid or missing PlayerID or Inventory"]);
    exit();
}
if (count($inventory) === 0) {
    ob_clean();
    echo json_encode(["warning" => "Empty inventory received. Save skipped."]);
    exit();
}

// Insert or update items (UPSERT)
foreach ($inventory as $item) {
    $itemName = $conn->real_escape_string($item["ItemName"] ?? "");
    $quantity = intval($item["Quantity"] ?? 0);
    if ($itemName && $quantity > 0) {
        $sql = "INSERT INTO Inventory (PlayerID, ItemName, Quantity)
                VALUES ($playerID, '$itemName', $quantity)
                ON DUPLICATE KEY UPDATE Quantity = $quantity";
        if (!$conn->query($sql)) {
            ob_clean();
            echo json_encode(["error" => "Failed to insert/update item: " . $conn->error]);
            exit();
        }
    }
}

ob_clean(); // Clean shebang
echo json_encode(["success" => true]);
$conn->close();
exit;
?>
