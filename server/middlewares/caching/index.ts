import {normalize, resolve} from "path";

// Types
import type {Strapi} from "@strapi/strapi";

// Lib
import {deleteCache, getCache, updateCache} from "./lib/cache";
import {generateKey, shouldCache, shouldInvalidateCaches, shouldUseCache} from "./lib/utilities";

export default (config, {strapi}: {strapi: Strapi})=>
{
	const cachefolder = resolve("/home", "endpoint-cache");

	return async (ctx, next) =>
	{
		const cacheKey = generateKey(ctx);

		// Try returning cache
		if (shouldUseCache(ctx))
		{
			const cacheContent = await getCache(cacheKey, cachefolder);
			if (!!cacheContent)
			{
				ctx.status = 200;
				ctx.body = JSON.parse(cacheContent);
				ctx.set("X-Cache", "HIT");
				return;
			}
		}

		// Handle server logic
		await next();

		// Cache response to file
		if (shouldCache(ctx))
		{
			updateCache(cacheKey, cachefolder, JSON.stringify(ctx.response.body));
			ctx.set("X-Cache", "MISS");
		}

		// Remove old cache when an entry is updated.
		if (shouldInvalidateCaches(ctx.request))
			deleteCache(ctx, cachefolder);
	};
};
