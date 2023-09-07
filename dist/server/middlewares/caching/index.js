"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Lib
const pluginId_1 = __importDefault(require("../../../admin/src/pluginId"));
const cache_1 = require("./lib/cache");
const utilities_1 = require("./lib/utilities");
exports.default = (config, { strapi }) => {
    return async (ctx, next) => {
        const service = strapi.service(`plugin::${pluginId_1.default}.adminService`);
        const pluginConfig = await (service === null || service === void 0 ? void 0 : service.getConfig)();
        if (!pluginConfig || !pluginConfig.cacheFolder)
            return await next();
        const cachefolder = pluginConfig.cacheFolder;
        const cacheKey = (0, utilities_1.generateKey)(ctx);
        // Try returning cache
        if ((0, utilities_1.shouldUseCache)(ctx, pluginConfig.cache)) {
            const cacheContent = await (0, cache_1.getCache)(cacheKey, cachefolder);
            if (!!cacheContent) {
                ctx.status = 200;
                ctx.body = JSON.parse(cacheContent);
                ctx.set("X-Cache", "HIT");
                return;
            }
        }
        // Handle server logic
        await next();
        // Cache response to file
        if ((0, utilities_1.shouldCache)(ctx, pluginConfig.cache)) {
            (0, cache_1.updateCache)(cacheKey, cachefolder, JSON.stringify(ctx.response.body));
            ctx.set("X-Cache", "MISS");
        }
        // Remove old cache when an entry is updated.
        if ((0, utilities_1.shouldInvalidateCaches)(ctx.request))
            (0, cache_1.deleteCache)(ctx, cachefolder);
    };
};
