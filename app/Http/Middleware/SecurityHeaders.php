<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Generate a nonce for this request
        $nonce = bin2hex(random_bytes(16));
        
        // Share the nonce in the app container so views can access it
        app()->singleton('csp_nonce', function () use ($nonce) {
            return $nonce;
        });

        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        $csp = "default-src 'self'; script-src 'self' 'nonce-{$nonce}' 'strict-dynamic'; style-src 'self' 'unsafe-inline' https://fonts.bunny.net; font-src 'self' data: https://fonts.bunny.net; img-src 'self' data: blob: https://images.unsplash.com; object-src 'none'; base-uri 'self'; form-action 'self';";
        
        // Di environment local, kita buka izin lebih luas agar Vite (port berapapun / IPv6) dan HMR tidak terblokir
        if (app()->environment('local')) {
            $csp = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; font-src * data:; img-src * data: blob:; connect-src * ws: wss:; object-src 'none'; base-uri 'self';";
        }
        
        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }
}
