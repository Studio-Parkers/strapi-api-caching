export default {
    routes: [{
        method: "GET",
        path: "/cachable-items",
        handler: "adminController.cachableitems",
        config: {
            policies: []
        }
    },
    {
        method: "GET",
        path: "/config",
        handler: "adminController.getConfig",
        config: {
            policies: []
        }
    },
    {
        method: "PUT",
        path: "/config",
        handler: "adminController.updateConfig",
        config: {
            policies: []
        }
    },
    {
        method: "GET",
        path: "/caches",
        handler: "adminController.currentCaches",
        config: {
            policies: []
        }
    },
    {
        method: "POST",
        path: "/caches",
        handler: "adminController.deleteCaches",
        config: {
            policies: []
        }
    }]
};