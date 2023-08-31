import {resolve} from "path";

// Types
import type {Strapi} from "@strapi/strapi";

// Lib
import {deleteCache, getCache, updateCache} from "./lib/cache";
import {generateKey, shouldCache, shouldInvalidateCaches, shouldUseCache} from "./lib/utilities";

// TODO: Implement the optinoal query cache option
export default (config, {strapi}: {strapi: Strapi})=>
{
	return async (ctx, next) =>
	{
        const service = strapi.service("plugin::strapi-api-caching.adminService");
        const pluginConfig = await (service?.getConfig as Function)();
        if (!pluginConfig || !pluginConfig.cacheFolder)
            return await next();

        const cachefolder = pluginConfig.cacheFolder;
		const cacheKey = generateKey(ctx);

		// Try returning cache
		if (shouldUseCache(ctx, pluginConfig.cache))
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
		if (shouldCache(ctx, pluginConfig.cache))
		{
			updateCache(cacheKey, cachefolder, JSON.stringify(ctx.response.body));
			ctx.set("X-Cache", "MISS");
		}

		// Remove old cache when an entry is updated.
		if (shouldInvalidateCaches(ctx.request))
			deleteCache(ctx, cachefolder);
	};
};
