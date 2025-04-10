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
    ob_clean(); //  Clean shebang
    echo json_encode(["error" => "Missing PlayerID"]);
    exit();
}

$stmt = $conn->prepare("SELECT PlayerID, Username, Coins FROM Player WHERE PlayerID = ?");
$stmt->bind_param("i", $playerID);
$stmt->execute();
$result = $stmt->get_result();

ob_clean(); //  Clean shebang before output

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["error" => "Player not found"]);
}

$stmt->close();
$conn->close();
?>
