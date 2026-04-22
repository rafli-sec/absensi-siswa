<?php

require_once 'vendor/autoload.php';

use App\Http\Controllers\Guru\RekapController;

$controller = new RekapController();
$result = $controller->getRekapPerMapel(1, '7A', 'Seni Budaya', [7,8,9,10,11,12], '2024/2025');

var_dump($result);