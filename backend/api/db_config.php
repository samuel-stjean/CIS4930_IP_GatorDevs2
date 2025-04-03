#!/usr/local/bin/php
<?php
$servername = "mysql.cise.ufl.edu";
$username = "samuel.stjean";
$password = "password"; 
$dbname = "Critter_Keeper_DB";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
