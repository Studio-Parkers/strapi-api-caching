"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = exports.findRelatedRoutes = exports.shouldInvalidateCaches = exports.shouldUseCache = exports.shouldCache = void 0;
const path_1 = require("path");
/**
 * Check the context to see if the response is something that you would want to cache.
 *
 * @param ctx
 * @returns
 */
const shouldCache = (ctx, config) => {
    if (!(0, exports.shouldUseCache)(ctx, config))
        return false;
    if (ctx.response.status < 200 || ctx.response.status >= 300)
        return false;
    return true;
};
exports.shouldCache = shouldCache;
/**
 * Check the context to see if the request would be something that is already cached
 * @param ctx
 * @returns
 */
const shouldUseCache = (ctx, config) => {
    if (!config)
        config = {};
    const path = ctx.request.path.replace("/api", "");
    if (!config[path] || !config[path].cache)
        return false;
    if (Object.keys(ctx.query).length !== 0 && !config[path].query)
        return false;
    if (ctx.request.method.toLowerCase() !== "get")
        return false;
    return true;
};
exports.shouldUseCache = shouldUseCache;
const shouldInvalidateCaches = (request) => {
    // POST is used to create new entries and PUT to update.
    if (request.method !== "POST" && request.method !== "PUT")
        return false;
    // CMS calls are send to content-manager
    if (!request.url.startsWith("/content-manager/"))
        return false;
    return true;
};
exports.shouldInvalidateCaches = shouldInvalidateCaches;
const findRelatedRoutes = (uid) => {
    const api = strapi.api;
    const results = [];
    for (let key in api) {
        for (let type in api[key].routes) {
            const typeRoutes = api[key].routes[type].routes;
            const routes = typeRoutes.filter(route => route.method.toLowerCase() === "get" && route.config.auth.scope.find(scope => scope.startsWith(uid)));
            results.push(...routes);
        }
    }
    for (let key in api) {
        for (let contentType in api[key].contentTypes) {
            const type = api[key].contentTypes[contentType];
            let hasReference = false;
            for (let attributeKey in type.attributes) {
                const attributes = type.attributes[attributeKey];
                if (attributes.type !== "relation" || attributes.target !== uid)
                    continue;
                hasReference = true;
            }
            if (hasReference)
                results.push(...(0, exports.findRelatedRoutes)(type.uid));
        }
    }
    return results;
};
exports.findRelatedRoutes = findRelatedRoutes;
const generateKey = (ctx) => {
    const requestPath = (0, path_1.normalize)(ctx.request.path).toLowerCase().trim();
    const keys = Object.keys(ctx.query);
    const query = keys.sort().map(key => `${key}=${typeof ctx.query[key] === "object" ? JSON.stringify(ctx.query[key]) : ctx.query[key]}`).join(",");
    return btoa(`${requestPath}?${query}`);
};
exports.generateKey = generateKey;
