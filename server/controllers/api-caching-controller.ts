import type {Strapi} from "@strapi/strapi";

export default ({strapi}: {strapi: Strapi})=> ({
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
    
        ctx.body = results;
    },
    async getConfig(ctx): Promise<void>
    {
        const config = await strapi
            .plugin("strapi-api-caching")
            .service("adminService")
            .getConfig();

        ctx.send(config ?? {});
    },
    async updateConfig(ctx): Promise<void>
    {
        const config = await strapi
            .plugin("strapi-api-caching")
            .service("adminService")
            .updateConfig(ctx);

        ctx.send(config);
    }
});