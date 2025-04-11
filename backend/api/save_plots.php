#!/usr/local/bin/php
<?php
ob_start();
require_once "db_config.php";
ob_clean();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
$playerId = intval($input["PlayerID"] ?? 0);
$plots = $input["Plots"] ?? [];

if (!$playerId || !is_array($plots)) {
    die(json_encode(["error" => "Invalid PlayerID or Plots"]));
}

// Delete existing plots for player
$conn->query("DELETE FROM PlayerPlots WHERE PlayerID = $playerId");

// Insert new plot data
$stmt = $conn->prepare("
    INSERT INTO PlayerPlots (PlayerID, PlotIndex, Type, Data)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE Type = VALUES(Type), Data = VALUES(Data)
");

foreach ($plots as $index => $plot) {
    $type = $plot["type"] ?? "empty";
    $data = json_encode($plot);
    $stmt->bind_param("iiss", $playerId, $index, $type, $data);
    $stmt->execute();
}


$stmt->close();
$conn->close();
echo json_encode(["success" => true]);
exit;
?>
