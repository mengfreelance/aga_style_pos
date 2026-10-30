<?php

return [
    'host'     => getenv('DB_HOST') ?: '127.0.0.1',
    'dbname'   => getenv('DB_NAME') ?: 'stylepos_db',
    'username' => getenv('DB_USER') ?: 'root',
    'password' => getenv('DB_PASS') ?: '',
    'charset'  => 'utf8mb4',
];
