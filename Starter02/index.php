<?php
date_default_timezone_set('UTC'); // Change timezone if needed

$serverTime = date('Y-m-d H:i:s');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Information</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }

        .card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        h1 {
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }

        td:first-child {
            font-weight: bold;
            width: 40%;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Server Information</h1>

        <table>
            <tr>
                <td>Current Server Time</td>
                <td><?= $serverTime ?></td>
            </tr>
            <tr>
                <td>Server Name</td>
                <td><?= $_SERVER['SERVER_NAME'] ?? 'N/A' ?></td>
            </tr>
            <tr>
                <td>Server Software</td>
                <td><?= $_SERVER['SERVER_SOFTWARE'] ?? 'N/A' ?></td>
            </tr>
            <tr>
                <td>PHP Version</td>
                <td><?= phpversion() ?></td>
            </tr>
            <tr>
                <td>Request Method</td>
                <td><?= $_SERVER['REQUEST_METHOD'] ?? 'N/A' ?></td>
            </tr>
            <tr>
                <td>Client IP</td>
                <td><?= $_SERVER['REMOTE_ADDR'] ?? 'N/A' ?></td>
            </tr>
            <tr>
                <td>Operating System</td>
                <td><?= php_uname() ?></td>
            </tr>
        </table>
    </div>
</body>
</html>