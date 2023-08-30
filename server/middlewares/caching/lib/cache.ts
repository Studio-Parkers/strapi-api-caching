import {resolve} from "path";
import {writeFile, mkdir, readFile, readdir, rm} from "fs/promises";

// Lib
import {findRelatedRoutes} from "./utilities";

export const getCache = async (key: string, cachefolder: string): Promise<string|null>=>
{
    const cacheFile = resolve(cachefolder, `${key}.json`);
    try {return await readFile(cacheFile, "utf8");}
    catch(error) {return null;}
};

export const updateCache = async (key: string, cachefolder: string, content: string)=>
{
    const cacheFile = resolve(cachefolder, `${key}.json`);

    try {await mkdir(cachefolder, {recursive: true});}
    catch(error) {return strapi.log.error(`Failed to update cache file: ${JSON.stringify(error)}`);}

    try {await writeFile(cacheFile, content);}
    catch(error) {strapi.log.error(JSON.stringify(error));}
};

export const deleteCache = async (ctx, cachefolder: string)=>
{
    const urlMatches = ctx.request.url.match(/(api::[a-zA-Z0-9]+\.[a-zA-Z0-9]+)/gm);
    if (urlMatches.length !== 1)
        return;

    const relatedRoutes = findRelatedRoutes(urlMatches[0]);
    for (let i in relatedRoutes)
    {
        let cacheFiles;
        try {cacheFiles = await readdir(cachefolder, {recursive: true});}
        catch(error) {return strapi.log.warn(`Failed to remove cache: ${JSON.stringify(error)}`);}

        const path = relatedRoutes[i].path.toLowerCase().trim().replace(/(:\w+)/gm, "(.+)");
        const relatedFiles = cacheFiles.filter(file=> 
        {
            const cacheFile = atob(file.substring(0, file.length - 5));
            return cacheFile.match(new RegExp(`/api${path}`));
        });

        for (let j in relatedFiles)
        {
            const filename = resolve(cachefolder, relatedFiles[j]);
            try {await rm(filename);}
            catch(error) {strapi.log.warn(`Failed to delete cache file ${filename}:\r\n${JSON.stringify(error)}`);}
        }
    }
};
