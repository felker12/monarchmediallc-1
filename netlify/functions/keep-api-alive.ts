import type { Config } from "@netlify/functions";

export default async function handler(
    _request: Request
): Promise<Response> {
    const apiUrl = process.env.KEEP_ALIVE_API_URL;

    if (!apiUrl) {
        console.error("KEEP_ALIVE_API_URL is not configured.");

        return new Response("Missing API URL configuration.", {
            status: 500,
        });
    }

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "User-Agent": "MMLLC-Netlify-KeepAlive",
            },
            signal: AbortSignal.timeout(20_000),
        });

        const responseBody = await response.text();

        if (!response.ok) {
            console.error(
                `Database health check failed: ${response.status}`,
                responseBody
            );

            return new Response("Database health check failed.", {
                status: 502,
            });
        }

        console.log(
            `Keep-alive succeeded (${response.status})`,
            responseBody
        );

        return new Response(responseBody, {
            status: response.status,
            headers: {
                "Content-Type":
                    response.headers.get("Content-Type") ??
                    "application/json",
            },
        });
    } catch (error) {
        console.error("Database health check request failed.", error);

        return new Response("Database health check request failed.", {
            status: 502,
        });
    }
}

export const config: Config = {
    schedule: "37 12 */3 * *",
};