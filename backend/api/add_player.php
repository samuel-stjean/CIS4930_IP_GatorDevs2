#!/usr/local/bin/php
<?php
require_once "db_config.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode(["error" => "Invalid request method. Use POST."]));
}

if (!isset($_POST['Username']) || !isset($_POST['Password'])) {
    die(json_encode(["error" => "Missing Username or Password field"]));
}

$Username = htmlspecialchars(trim($_POST['Username']));
$Password = password_hash(trim($_POST['Password']), PASSWORD_DEFAULT);


$stmt = $conn->prepare("INSERT INTO Player (Username, Password) VALUES (?, ?)");

if (!$stmt) {
    die(json_encode(["error" => "Prepare failed: " . $conn->error]));
}
$stmt->bind_param("ss", $Username, $Password);

if (!$stmt->execute()) {
    die(json_encode(["error" => "Execute failed: " . $stmt->error]));
}

$stmt->close();
$conn->close();
echo json_encode(["success" => "Player added successfully"]);
exit;
?>
