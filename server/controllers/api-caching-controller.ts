import {resolve, extname} from "path";
import {readdir, stat, rm} from "fs/promises";

// Types
import type {Strapi} from "@strapi/strapi";

// Lib
import pluginID from "../../admin/src/pluginId";

const formatBytes = (bytes, decimals = 2)=>
{
    if (!+bytes)
        return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default ({strapi}: {strapi: Strapi})=> ({
    async currentCaches(ctx): Promise<void>
    {
        ctx.body = [];
        const config = await strapi
            .plugin(pluginID)
            .service("adminService")
            .getConfig();

        if (!config || !config.cacheFolder)
            return;

        let cacheFiles;
        try {cacheFiles = await readdir(config.cacheFolder, {recursive: true});}
        catch(error) {return console.log(error);}

        // Make sure only json files are added
        cacheFiles = cacheFiles.filter(file=> extname(file).toLowerCase() === ".json");

        const results: any[] = [];
        for (let i in cacheFiles)
        {
            let route;
            try {route = atob(cacheFiles[i].substring(0, cacheFiles[i].length - 5));}
            catch(error){continue;}

            const path = resolve(config.cacheFolder, cacheFiles[i]);

            let info;
            try {info = await stat(path);}
            catch(error){info = {};}

            results.push({
                file: path,
                route,
                size: formatBytes(info.size),
                date: info.mtime
            });
        }

        ctx.body = results;
        
    },
    async deleteCaches(ctx): Promise<void>
    {
        ctx.body = [];
        const config = await strapi
            .plugin(pluginID)
            .service("adminService")
            .getConfig();

        if (!config || !config.cacheFolder)
            return;

        const files = ctx.request.body.files ?? [];
        for (let i in files)
        {
            try {await rm(files[i]);}
            catch(error) {strapi.log.warning(`Failed to delete cache file ${files[i]}`);}
        }
    },
    async cachableitems(ctx): Promise<void>
    {
        const results = {};
        for (let key in strapi.api)
        {
            if (!results[key])
                results[key] = [];
            
            for (let type in strapi.api[key].routes)
            {
                const routes = strapi.api[key].routes[type].routes.filter(route=> route.method.toLowerCase() === "get" && route.info.type.toLowerCase() === "content-api");
                results[key].push(...routes);
            }
        }
    
        ctx.send(results);
    },
    async getConfig(ctx): Promise<void>
    {
        const config = await strapi
            .plugin(pluginID)
            .service("adminService")
            .getConfig();

        ctx.send(config ?? {});
    },
    async updateConfig(ctx): Promise<void>
    {
        const config = await strapi
            .plugin(pluginID)
            .service("adminService")
            .updateConfig(ctx);

        ctx.send(config);
    }
});
