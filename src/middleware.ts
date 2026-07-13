// src/middleware.ts
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
    const currentPath = context.url.pathname;

    // 1. Check if the request is targeting an administrative area or an admin API endpoint
    const isAdminRoute = currentPath.startsWith('/admin') || currentPath.startsWith('/api/admin');

    if (!isAdminRoute) {
        // Safe fall-through for static public pages (/, /portfolio, /contact)
        // No cookie reading happens here, meaning NO headers are touched during build compile!
        context.locals.isLoggedIn = false;
        return next();
    }

    // 2. Authentication Logic (ONLY runs on administrative routes)
    const hasToken = context.cookies.has("admin_token");
    context.locals.isLoggedIn = hasToken;

    // Guard Rail: Prevent logged-in users from seeing the login page again
    if (currentPath === '/admin/login' && hasToken) {
        return context.redirect('/admin/dashboard');
    }

    // Guard Rail: Protect administrative pages from unauthenticated eyes
    if (currentPath !== '/admin/login' && !hasToken) {
        return context.redirect('/admin/login');
    }

    return next();
});