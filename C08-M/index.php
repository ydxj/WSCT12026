<?php
// C08-M: Job Search & Pagination
// Plain PHP, no frameworks/dependencies.
// GET /jobs?search=&page=  -> filtered + paginated, with a meta block
// Run: php -S localhost:4000 index.php  -> http://localhost:4000/jobs
declare(strict_types=1);

header('Content-Type: application/json');

const PER_PAGE = 10;

function sendJson(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $path === '/jobs') {
    $jobs = json_decode(file_get_contents(__DIR__ . '/data/jobs.json'), true, 512, JSON_THROW_ON_ERROR);

    $search = strtolower(trim($_GET['search'] ?? ''));
    $page = filter_var($_GET['page'] ?? 1, FILTER_VALIDATE_INT);
    if ($page === false || $page < 1) {
        $page = 1;
    }

    $filtered = $search === ''
        ? $jobs
        : array_values(array_filter($jobs, function ($j) use ($search) {
            return str_contains(strtolower($j['title']), $search)
                || str_contains(strtolower($j['company']), $search);
        }));

    $total = count($filtered);
    $totalPages = max(1, (int) ceil($total / PER_PAGE));
    $start = ($page - 1) * PER_PAGE;
    $pageItems = array_slice($filtered, $start, PER_PAGE);

    sendJson(200, [
        'data' => $pageItems,
        'meta' => [
            'total' => $total,
            'page' => $page,
            'per_page' => PER_PAGE,
            'total_pages' => $totalPages,
        ],
    ]);
}

sendJson(404, ['error' => 'Not found']);
