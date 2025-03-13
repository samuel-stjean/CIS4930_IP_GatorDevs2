#!/usr/local/bin/php

<!DOCTYPE html>
<html>
<head>
    <title>PHP Backend Test</title>
</head>
<body>
    <h1>Test PHP Backend</h1>

    <h2>Current Persons in Database</h2>
    <table border="1">
        <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Action</th>
        </tr>

        <?php
        $api_url = "https://www.cise.ufl.edu/~samuel.stjean/Critter_Keeper/backend/api/show.php"; //REPLACE_LINK
        $response = file_get_contents($api_url);
        
        // Remove the first line if it contains the shebang
        $response_lines = explode("\n", $response);
        if (strpos($response_lines[0], "#!") === 0) {
            array_shift($response_lines); // Remove the first line
        }
        $cleaned_response = implode("\n", $response_lines);
        
        // Decode the cleaned JSON
        $persons = json_decode($cleaned_response, true);
        
        if ($persons === null) {
            echo "<p>Error: Could not parse JSON (".json_last_error_msg().")</p>";
            echo "<pre>Raw response: " . htmlspecialchars($cleaned_response) . "</pre>";
            exit;
        }
        
        if (!empty($persons)) {
            foreach ($persons as $person) {
                echo "<tr>";
                echo "<td>{$person['Personid']}</td>";
                echo "<td>{$person['FirstName']}</td>";
                echo "<td>{$person['LastName']}</td>";
                echo "<td>{$person['Age']}</td>";
                echo "<td><a href='https://www.cise.ufl.edu/~samuel.stjean/Critter_Keeper/backend/api/delete.php?Personid={$person['Personid']}'>Delete</a></td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='5'>No persons found</td></tr>";
        }
        ?>
    </table>

    <h2>Add a New Person</h2>
    <form action="<?php echo dirname($_SERVER['SCRIPT_NAME']) . '/../api/add.php'; ?>" method="post">
        <label>First Name:</label>
        <input type="text" name="FirstName" required><br>
        <label>Last Name:</label>
        <input type="text" name="LastName" required><br>
        <label>Age:</label>
        <input type="number" name="Age" required><br>
        <input type="submit" value="Add Person">
    </form>
</body>
</html>
