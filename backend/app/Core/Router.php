<?php

namespace StylePOS\Core;

class Router
{
    private $routes = [];
    private $middleware = [];

    public function middleware(string $name, callable $handler): void
    {
        $this->middleware[$name] = $handler;
    }

    public function get(string $path, callable $handler, array $middleware = []): void
    {
        $this->addRoute('GET', $path, $handler, $middleware);
    }

    public function post(string $path, callable $handler, array $middleware = []): void
    {
        $this->addRoute('POST', $path, $handler, $middleware);
    }

    public function put(string $path, callable $handler, array $middleware = []): void
    {
        $this->addRoute('PUT', $path, $handler, $middleware);
    }

    public function delete(string $path, callable $handler, array $middleware = []): void
    {
        $this->addRoute('DELETE', $path, $handler, $middleware);
    }

    private function addRoute(string $method, string $path, callable $handler, array $middleware): void
    {
        $this->routes[$method][$path] = ['handler' => $handler, 'middleware' => $middleware];
    }

    public function resolve(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH);

        if (isset($this->routes[$method][$path])) {
            $route = $this->routes[$method][$path];
            $this->runMiddleware($route['middleware']);
            $route['handler']();
            return;
        }

        foreach ($this->routes[$method] as $routePath => $route) {
            if (strpos($routePath, '{') === false) {
                continue;
            }
            $params = $this->matchRoute($routePath, $path);
            if ($params !== false) {
                $this->runMiddleware($route['middleware']);
                $handler = $route['handler'];
                if (!empty($params)) {
                    $handler(...array_values($params));
                } else {
                    $handler();
                }
                return;
            }
        }

        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Route not found']);
    }

    private function runMiddleware(array $middleware): void
    {
        foreach ($middleware as $mwName) {
            if (isset($this->middleware[$mwName])) {
                ($this->middleware[$mwName])();
            }
        }
    }

    private function matchRoute(string $pattern, string $path): array|false
    {
        $patternParts = explode('/', trim($pattern, '/'));
        $pathParts = explode('/', trim($path, '/'));

        if (count($patternParts) !== count($pathParts)) {
            return false;
        }

        $params = [];
        foreach ($patternParts as $i => $part) {
            if (preg_match('/^\{(\w+)\}$/', $part, $matches)) {
                $params[$matches[1]] = $pathParts[$i];
            } elseif ($part !== $pathParts[$i]) {
                return false;
            }
        }

        return $params;
    }
}
