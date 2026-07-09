// src/pages/admin/logout.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ cookies, url }) => {
    //Wipe out the security token cookie instantly
    cookies.delete('admin_token', { path: '/' });

    //Read where they came from, or default to the homepage
    const redirectTarget = url.searchParams.get('redirect') || '/';

    //Since this is a pure API route and hasn't started rendering HTML headers, 
    //we can use a pristine server-side HTTP 302 Redirect!
    return new Response(null, {
        status: 302,
        headers: {
            'Location': redirectTarget
        }
    });
};