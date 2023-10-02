"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCache = exports.updateCache = exports.getCache = void 0;
const path_1 = require("path");
const promises_1 = require("fs/promises");
// Lib
const utilities_1 = require("./utilities");
const getCache = async (key, cachefolder) => {
    const cacheFile = (0, path_1.resolve)(cachefolder, `${key}.json`);
    try {
        return await (0, promises_1.readFile)(cacheFile, "utf8");
    }
    catch (error) {
        return null;
    }
};
exports.getCache = getCache;
const updateCache = async (key, cachefolder, content) => {
    const cacheFile = (0, path_1.resolve)(cachefolder, `${key}.json`);
    try {
        await (0, promises_1.mkdir)(cachefolder, { recursive: true });
    }
    catch (error) {
        return strapi.log.error(`Failed to update cache file: ${JSON.stringify(error)}`);
    }
    try {
        await (0, promises_1.writeFile)(cacheFile, content);
    }
    catch (error) {
        strapi.log.error(JSON.stringify(error));
    }
};
exports.updateCache = updateCache;
const deleteCache = async (ctx, cachefolder) => {
    const urlMatches = ctx.request.url.match(/(api::[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+)/gm);
    if ((urlMatches === null || urlMatches === void 0 ? void 0 : urlMatches.length) !== 1)
        return;
    const relatedRoutes = (0, utilities_1.findRelatedRoutes)(urlMatches[0]);
    for (let i in relatedRoutes) {
        let cacheFiles;
        try {
            cacheFiles = await (0, promises_1.readdir)(cachefolder, { recursive: true });
        }
        catch (error) {
            return strapi.log.warn(`Failed to remove cache: ${JSON.stringify(error)}`);
        }
        const path = relatedRoutes[i].path.toLowerCase().trim().replace(/(:\w+)/gm, "(.+)");
        const relatedFiles = cacheFiles.filter(file => {
            const cacheFile = atob(file.substring(0, file.length - 5));
            return cacheFile.match(new RegExp(`/api${path}`));
        });
        for (let j in relatedFiles) {
            const filename = (0, path_1.resolve)(cachefolder, relatedFiles[j]);
            try {
                await (0, promises_1.rm)(filename);
            }
            catch (error) {
                strapi.log.warn(`Failed to delete cache file ${filename}:\r\n${JSON.stringify(error)}`);
            }
        }
    }
};
exports.deleteCache = deleteCache;
