<?php
require __DIR__ . '/../vendor/autoload.php';

use App\Config\App;

error_reporting(E_ALL);
ini_set('display_errors', 1);

$app = App::create();

require __DIR__ . '/../src/Routes/api.php';

$app->run();