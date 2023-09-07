"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const promises_1 = require("fs/promises");
// Lib
const pluginId_1 = __importDefault(require("../../admin/src/pluginId"));
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes)
        return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
exports.default = ({ strapi }) => ({
    async currentCaches(ctx) {
        ctx.body = [];
        const config = await strapi
            .plugin(pluginId_1.default)
            .service("adminService")
            .getConfig();
        if (!config || !config.cacheFolder)
            return;
        let cacheFiles;
        try {
            cacheFiles = await (0, promises_1.readdir)(config.cacheFolder, { recursive: true });
        }
        catch (error) {
            return console.log(error);
        }
        const results = [];
        for (let i in cacheFiles) {
            const path = (0, path_1.resolve)(config.cacheFolder, cacheFiles[i]);
            let info;
            try {
                info = await (0, promises_1.stat)(path);
            }
            catch (error) {
                info = {};
            }
            results.push({
                file: path,
                route: atob(cacheFiles[i].substring(0, cacheFiles[i].length - 5)),
                size: formatBytes(info.size),
                date: info.mtime
            });
        }
        ctx.body = results;
    },
    async deleteCaches(ctx) {
        var _a;
        ctx.body = [];
        const config = await strapi
            .plugin(pluginId_1.default)
            .service("adminService")
            .getConfig();
        if (!config || !config.cacheFolder)
            return;
        const files = (_a = ctx.request.body.files) !== null && _a !== void 0 ? _a : [];
        for (let i in files) {
            try {
                await (0, promises_1.rm)(files[i]);
            }
            catch (error) {
                strapi.log.warning(`Failed to delete cache file ${files[i]}`);
            }
        }
    },
    async cachableitems(ctx) {
        const results = {};
        for (let key in strapi.api) {
            if (!results[key])
                results[key] = [];
            for (let type in strapi.api[key].routes) {
                const routes = strapi.api[key].routes[type].routes.filter(route => route.method.toLowerCase() === "get" && route.info.type.toLowerCase() === "content-api");
                results[key].push(...routes);
            }
        }
        ctx.send(results);
    },
    async getConfig(ctx) {
        const config = await strapi
            .plugin(pluginId_1.default)
            .service("adminService")
            .getConfig();
        ctx.send(config !== null && config !== void 0 ? config : {});
    },
    async updateConfig(ctx) {
        const config = await strapi
            .plugin(pluginId_1.default)
            .service("adminService")
            .updateConfig(ctx);
        ctx.send(config);
    }
});
