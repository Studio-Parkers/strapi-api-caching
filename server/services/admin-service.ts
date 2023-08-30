export default ({strapi}) => ({
    getConfig()
    {
        try 
        {
            const pluginStore = strapi.store({
                environment: strapi.config.environment,
                type: "plugin",
                name: "strapi-api-caching"
            });

            return pluginStore.get({key: "strapi-api-caching"});
        }
        catch (error)
        {
            strapi.log.error(error.message);
            return {error: "An error occurred while fetching the plugin config.",};
        }
    },
    
    updateConfig(ctx)
    {
        try
        {
            const pluginStore = strapi.store({
                environment: strapi.config.environment,
                type: "plugin",
                name: "strapi-api-caching"
            });

            return pluginStore.set({
                key: "strapi-api-caching",
                value: {
                    cacheFolder: ctx.request.body.cacheFolder,
                    cache: ctx.request.body.cache
                }
            });
        }
        catch (error)
        {
            strapi.log.error(error.message);
            return {error: "An error occurred while updting the chatGPT config. Please try after some time"};
        }
    }
});