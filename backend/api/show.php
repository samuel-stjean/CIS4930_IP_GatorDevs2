#!/usr/local/bin/php
<?php
// Start output buffering immediately to capture ALL output (including shebang)
ob_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");
header("Content-Type: application/json");

require_once "db_config.php";

// Fetch data from the database
$sql = "SELECT * FROM Persons";
$result = $conn->query($sql);

$persons = [];
while ($row = $result->fetch_assoc()) {
    $persons[] = $row;
}

$conn->close();

// Get full output buffer and clean any unwanted content
$output = ob_get_clean();

// Ensure only valid JSON is sent by **removing the shebang line explicitly**
$output = preg_replace('/^#!.*\n/', '', $output);

// Print only the cleaned JSON response
echo json_encode($persons);

// Forcefully exit to prevent any other output leakage
exit();
?>
