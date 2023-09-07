"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("../../admin/src/pluginId"));
exports.default = ({ strapi }) => ({
    getConfig() {
        try {
            const pluginStore = strapi.store({
                environment: strapi.config.environment,
                type: "plugin",
                name: pluginId_1.default
            });
            return pluginStore.get({ key: pluginId_1.default });
        }
        catch (error) {
            strapi.log.error(error.message);
            return { error: "An error occurred while fetching the plugin config.", };
        }
    },
    updateConfig(ctx) {
        try {
            const pluginStore = strapi.store({
                environment: strapi.config.environment,
                type: "plugin",
                name: pluginId_1.default
            });
            return pluginStore.set({
                key: pluginId_1.default,
                value: {
                    cacheFolder: ctx.request.body.cacheFolder,
                    cache: ctx.request.body.cache
                }
            });
        }
        catch (error) {
            strapi.log.error(error.message);
            return { error: "An error occurred while updting the chatGPT config. Please try after some time" };
        }
    }
});
