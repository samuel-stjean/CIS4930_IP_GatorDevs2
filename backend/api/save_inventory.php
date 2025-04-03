#!/usr/local/bin/php
<?php
require_once "db_config.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { die(json_encode(["error" => "Invalid request method. Use POST."])); }

$input = json_decode(file_get_contents("php://input"), true);
$playerID = $input["PlayerID"] ?? null;
$inventory = $input["Inventory"] ?? [];

if (!$playerID || !is_array($inventory)) {
    die(json_encode(["error" => "Invalid or missing PlayerID or Inventory"]));
}

// Clear current inventory
$conn->query("DELETE FROM PlayerInventory WHERE PlayerID = " . intval($playerID));

// Insert new items
foreach ($inventory as $item) {
    $plantID = isset($item["PlantID"]) ? intval($item["PlantID"]) : "NULL";
    $critterID = isset($item["CritterID"]) ? intval($item["CritterID"]) : "NULL";
    $happiness = isset($item["HappinessLevel"]) ? intval($item["HappinessLevel"]) : "NULL";

    $sql = "INSERT INTO PlayerInventory (PlayerID, PlantID, CritterID, HappinessLevel)
            VALUES ($playerID, $plantID, $critterID, $happiness)";
    if (!$conn->query($sql)) {
        die(json_encode(["error" => "Failed to insert item: " . $conn->error]));
    }
}

echo json_encode(["success" => true]);
$conn->close();
exit;
?>
