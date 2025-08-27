// Cloudflare Worker to serve Vite SPA from static assets in dist/
// - Serves /assets/* and other static files directly
// - Falls back to /index.html for SPA routes
// - Adds basic caching headers

export interface Env {
  ASSETS: Fetcher; // bound to the dist folder via wrangler.toml assets.directory
}

const CACHE_TTL = 60 * 10; // 10 minutes

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Try to fetch static asset first
    const assetResponse = await env.ASSETS.fetch(new Request(url.toString(), request));

    if (assetResponse.status !== 404) {
      // Set cache headers for static assets
      const res = new Response(assetResponse.body, assetResponse);
      res.headers.set("Cache-Control", `public, max-age=${CACHE_TTL}`);
      return res;
    }

    // SPA fallback: serve index.html
    const indexUrl = new URL("/index.html", url.origin);
    const indexResponse = await env.ASSETS.fetch(new Request(indexUrl.toString(), request));

    if (indexResponse.status === 404) {
      return new Response("index.html not found in assets", { status: 500 });
    }

    // Avoid caching the HTML document aggressively
    const html = new Response(indexResponse.body, indexResponse);
    html.headers.set("Cache-Control", "no-cache");
    html.headers.set("Content-Type", "text/html; charset=utf-8");
    return html;
  },
};
