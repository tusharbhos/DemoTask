<?php

return [
    /*
     * Public API - allow all origins for GET requests
     */
    'paths'                    => ['api/*'],
    'allowed_methods'          => ['GET', 'OPTIONS'],
    'allowed_origins'          => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => [],
    'max_age'                  => 86400,
    'supports_credentials'     => false,
];
