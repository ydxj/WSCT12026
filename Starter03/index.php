<?php
// Starter Task 03: Back-end with Database
// Reads data/records.json, ensures a MySQL table exists, inserts the rows
// (idempotently), then renders them as an HTML table.
//
// IMPORTANT: replace data/records.json with the ACTUAL records supplied in
// your competition's media asset folder — this file only ships a placeholder
// sample so the project runs out of the box.
//
// Setup:
//   set env vars (or edit the defaults below): DB_HOST, DB_USER, DB_PASS, DB_NAME
//   php -S localhost:3001  ->  http://localhost:3001
declare(strict_types=1);

$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';
$dbName = getenv('DB_NAME') ?: 'starter03';

function h(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function renderTable(array $rows): string {
    $headers = $rows ? array_keys($rows[0]) : [];
    $thead = implode('', array_map(fn($h) => '<th>' . htmlspecialchars((string)$h, ENT_QUOTES, 'UTF-8') . '</th>', $headers));
    $tbody = implode('', array_map(function ($r) use ($headers) {
        $cells = implode('', array_map(fn($h) => '<td>' . htmlspecialchars((string)$r[$h], ENT_QUOTES, 'UTF-8') . '</td>', $headers));
        return "<tr>{$cells}</tr>";
    }, $rows));

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Starter 03 - DB Records</title>
<style>
  body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;padding:2rem;}
  table{border-collapse:collapse;width:100%;max-width:700px;margin:auto;}
  th,td{border:1px solid #334155;padding:8px 12px;text-align:left;}
  th{background:#1e293b;}
  h1{text-align:center;}
</style></head>
<body>
  <h1>Records loaded from MySQL</h1>
  <table><thead><tr>{$thead}</tr></thead><tbody>{$tbody}</tbody></table>
</body>
</html>
HTML;
}

try {
    // Connect without a database first so we can CREATE DATABASE IF NOT EXISTS.
    $bootstrap = new PDO("mysql:host={$dbHost}", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $bootstrap->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}`");
    $bootstrap = null;  

    $pdo = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS records (
          id INT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          price DECIMAL(10,2),
          stock INT
        )
    ");

    $records = json_decode(file_get_contents(__DIR__ . '/data/records.json'), true, 512, JSON_THROW_ON_ERROR);

    $insert = $pdo->prepare("
        INSERT INTO records (id, name, category, price, stock) VALUES (:id, :name, :category, :price, :stock)
        ON DUPLICATE KEY UPDATE name = VALUES(name), category = VALUES(category),
          price = VALUES(price), stock = VALUES(stock)
    ");
    foreach ($records as $r) {
        $insert->execute([
            'id' => $r['id'],
            'name' => $r['name'],
            'category' => $r['category'],
            'price' => $r['price'],
            'stock' => $r['stock'],
        ]);
    }

    $rows = $pdo->query('SELECT * FROM records ORDER BY id')->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: text/html; charset=utf-8');
    echo renderTable($rows);
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'DB error: ' . $e->getMessage() .
        "\n\nMake sure MySQL is running and DB_HOST/DB_USER/DB_PASS/DB_NAME env vars are set.";
}
