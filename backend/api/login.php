#!/usr/local/bin/php
<?php
ob_start();

require_once "db_config.php";

// Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");

// Clean output to remove shebang
ob_clean();
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
$username = $conn->real_escape_string($input["Username"] ?? "");
$password = $input["Password"] ?? "";

$stmt = $conn->prepare("SELECT PlayerID, Password, Coins FROM Player WHERE Username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row["Password"])) {
        echo json_encode(["success" => true, "PlayerID" => $row["PlayerID"], "Coins" => $row["Coins"]]); // found user
    } else {
        echo json_encode(["error" => "Incorrect password"]); // Username not found
    }    
    
} else {
    echo json_encode(["error" => "Username not found"]);
}

$stmt->close();
$conn->close();
exit;
?>
