#!/usr/local/bin/php
<?php
ob_start();
require_once "db_config.php";
ob_clean();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$input = json_decode(file_get_contents("php://input"), true);
$username = $conn->real_escape_string($input["Username"] ?? "");
$password = password_hash($input["Password"] ?? "", PASSWORD_BCRYPT);

if (!$username || !$password) {
    die(json_encode(["error" => "Username and password required."]));
}

$stmt = $conn->prepare("INSERT INTO Player (Username, Password, Coins) VALUES (?, ?, 100)");
$stmt->bind_param("ss", $username, $password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "PlayerID" => $stmt->insert_id]); // Success: return new PlayerID
} else {
    $error = $conn->errno === 1062 ? "Username already taken." : $stmt->error; // Handle potential errors like duplicate username
    echo json_encode(["error" => $error]);
}

$stmt->close();
$conn->close();
exit;
?>
