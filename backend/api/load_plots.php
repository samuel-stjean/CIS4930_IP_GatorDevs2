#!/usr/local/bin/php
<?php
ob_start();
require_once "db_config.php";
ob_clean();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$playerId = intval($_GET["PlayerID"] ?? 0);
if (!$playerId) {
    die(json_encode(["error" => "Missing PlayerID"]));
}

$stmt = $conn->prepare("SELECT PlotIndex, Data FROM PlayerPlots WHERE PlayerID = ? ORDER BY PlotIndex ASC");
$stmt->bind_param("i", $playerId);
$stmt->execute();
$result = $stmt->get_result();

$plots = [];
while ($row = $result->fetch_assoc()) {
    $decoded = json_decode($row["Data"], true);
    if ($decoded) {
        $plots[$row["PlotIndex"]] = $decoded;
    }
}

$stmt->close();
$conn->close();
echo json_encode(array_values($plots));
exit;
?>
