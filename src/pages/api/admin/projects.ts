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
        const formData = await request.formData();
        const actionType = formData.get('action')?.toString();
        const projectId = formData.get('id')?.toString();

        //SECURE DELETE ACTION
        if (actionType === 'delete' && projectId) {
            const response = await fetch(`${API_BASE_URL}/api/admin/projects/${projectId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                return new Response(JSON.stringify({ error: `Deletion failed: ${response.statusText}` }), { status: response.status });
            }

            return redirect('/admin/projects?success=Project+removed+successfully.');
        }

        //SCENARIO SECURE CREATE OR UPDATE
        const displayOrderValue = parseInt(formData.get('displayOrder')?.toString() || '0', 10);

        const payload = {
            title: formData.get('title')?.toString().trim(),
            description: formData.get('description')?.toString().trim(),
            techStack: formData.get('techStack')?.toString().trim() || null,
            liveUrl: formData.get('liveUrl')?.toString().trim() || null,
            imagePath: formData.get('imagePath')?.toString().trim() || null,
            imageAlt: formData.get('imageAlt')?.toString().trim() || null,
            package: parseInt(formData.get('package')?.toString() || '0', 10),
            featured: formData.get('featured') === 'true',
            displayOrder: displayOrderValue < 0 ? 0 : displayOrderValue,
            completedOn: formData.get('completedOn')?.toString() || null,
            isPublic: formData.get('isPublic') === 'true',
            industry: parseInt(formData.get('industry')?.toString() || '0', 10),
            clientName: formData.get('clientName')?.toString().trim() || null
        };

        if (!payload.title || !payload.description) {
            return redirect(`/admin/projects?error=Title+and+Description+are+required.${projectId ? `&edit=${projectId}` : ''}`);
        }
        if (displayOrderValue < 0) {
            return redirect(`/admin/projects?error=Display+Order+cannot+be+negative.${projectId ? `&edit=${projectId}` : ''}`);
        }

        const isEditSubmission = !!projectId;
        const endpoint = isEditSubmission ? `${API_BASE_URL}/api/admin/projects/${projectId}` : `${API_BASE_URL}/api/admin/projects`;
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
            const msg = isEditSubmission ? 'Project+updated+successfully!' : 'Project+created+successfully!';
            return redirect(`/admin/projects?success=${msg}`);
        } else {
            const errText = await response.text();
            return redirect(`/admin/projects?error=Backend+Error:+${encodeURIComponent(errText || response.statusText)}${projectId ? `&edit=${projectId}` : ''}`);
        }

    } catch (e) {
        console.error('Modifier Exception Layers:', e);
        return redirect('/admin/projects?error=An+error+occurred+while+linking+metadata+operations.');
    }
};