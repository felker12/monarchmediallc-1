// src/data/projects.ts
import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const token = cookies.get('admin_token')?.value;
    if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized credentials.' }), { status: 401 });
    }

    const API_BASE_URL = import.meta.env.AZURE_API_URL;

    try {
        // Parse the incoming body as JSON instead of formData
        const body = await request.json();

        const actionType = body.action?.toString();
        const projectId = body.id?.toString();

        // SECURE DELETE ACTION
        if (actionType === 'delete' && projectId) {
            const response = await fetch(`${API_BASE_URL}/api/admin/projects/${projectId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                return new Response(JSON.stringify({ error: `Deletion failed: ${response.statusText}` }), { status: response.status });
            }

            // If the client submitted via standard HTML Form, redirect works. 
            // If submitted via AJAX fetch(), you should return a JSON response so the client handles window.location.href.
            if (request.headers.get('accept')?.includes('text/html')) {
                return redirect('/admin/projects?success=Project+removed+successfully.');
            }
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        // SCENARIO SECURE CREATE OR UPDATE
        const displayOrderValue = parseInt(body.displayOrder || '0', 10);

        const payload = {
            title: body.title?.toString().trim(),
            description: body.description?.toString().trim(),
            techStack: body.techStack?.toString().trim() || null,
            liveUrl: body.liveUrl?.toString().trim() || null,
            siteImageId: body.siteImageId ? parseInt(body.siteImageId, 10) : null,
            package: parseInt(body.package || '0', 10),
            featured: body.featured === true || body.featured === 'true',
            displayOrder: displayOrderValue < 0 ? 0 : displayOrderValue,
            completedOn: body.completedOn?.toString() || null,
            isPublic: body.isPublic === true || body.isPublic === 'true',
            industry: parseInt(body.industry || '0', 10),
            clientName: body.clientName?.toString().trim() || null
        };

        if (!payload.title || !payload.description) {
            return new Response(JSON.stringify({ error: 'Title and Description are required.' }), { status: 400 });
        }

        const isEditSubmission = !!projectId;
        const endpoint = isEditSubmission ? `${API_BASE_URL}/api/admin/projects/${projectId}` : `${API_BASE_URL}/api/admin/projects`;

        // Match standard REST standards used by your C# Backend (PUT for edit, POST for create)
        const httpMethod = isEditSubmission ? 'PUT' : 'POST';

        const response = await fetch(endpoint, {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            const errText = await response.text();
            return new Response(JSON.stringify({ error: errText || response.statusText }), { status: response.status });
        }

    } catch (e) {
        console.error('Modifier Exception Layers:', e);
        return new Response(JSON.stringify({ error: 'An error occurred while linking metadata operations.' }), { status: 500 });
    }
};