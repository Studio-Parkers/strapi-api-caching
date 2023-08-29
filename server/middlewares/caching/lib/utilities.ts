import {normalize} from "path";

/**
 * Check the context to see if the response is something that you would want to cache.
 * 
 * @param ctx 
 * @returns 
 */
export const shouldCache = (ctx): boolean=>
{
    if (!shouldUseCache(ctx))
        return false;

    if (ctx.response.status < 200 || ctx.response.status >= 300)
        return false;

    return true;
};

/**
 * Check the context to see if the request would be something that is already cached
 * @param ctx 
 * @returns 
 */
export const shouldUseCache = (ctx): boolean=>
{
    if (!ctx.request.path.startsWith("/api"))
        return false;

    if (ctx.request.method.toLowerCase() !== "get")
        return false;

    return true;
}


export const shouldInvalidateCaches = (request): boolean=>
{
    // POST is used to create new entries and PUT to update.
    if (request.method !== "POST" && request.method !== "PUT")
        return false;

    // CMS calls are send to content-manager
    if (!request.url.startsWith("/content-manager/"))
        return false;

    return true;
};

declare type Route = {
    method: string;
    path: string;
    config: {
        auth: {
            scope: string[];
        }
    };
};

export const findRelatedRoutes = (uid: string)=>
{
    const api: Record<string, {routes: {routes: Route[]}[]}> = strapi.api;
    const results: Route[] = [];
    
    for (let key in api)
    {
        for (let type in api[key].routes)
        {
            const routes = api[key].routes[type].routes.filter(route=> route.method.toLowerCase() === "get" && route.config.auth.scope.find(scope=> scope.startsWith(uid)));
            results.push(...routes);
        }
    }

    return results;
};

export const generateKey = (ctx): string=>
{
    const requestPath = normalize(ctx.request.path)
        .toLowerCase()
        .trim()
        .replace(/\/$/, "") 	  // Remove trailing slash
        .replace(/\/api\//gm, "") // Remove /api/ from route
        .replace(/[^\w]/gm, "-"); // Replace special characters with a dash

    // str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    const keys = Object.keys(ctx.query);	  		  
    const query = keys.sort()
        .map(key=> `${key}=${typeof ctx.query[key] === "object" ? JSON.stringify(ctx.query[key]) : ctx.query[key]}`)
        .join(",")
        .replace(/(['"])/gm, "");

    return `${requestPath}-${query}`;
};