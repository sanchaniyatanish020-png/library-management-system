<?php
require __DIR__ . '/../vendor/autoload.php';

use App\Config\App;

$app = App::create();

require __DIR__ . '/../src/Routes/api.php';

$app->run();