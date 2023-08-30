import {prefixPluginTranslations} from "@strapi/helper-plugin";

import pluginId from "./pluginId";
import pluginPkg from "../../package.json";
import PluginIcon from "./components/PluginIcon";
import Initializer from "./components/Initializer";

const name = pluginPkg.strapi.name;

export default
{
    register(app: any) {
        app.addMenuLink({
            to: `/plugins/${pluginId}`,
            icon: PluginIcon,
            intlLabel: {
                id: `${pluginId}.plugin.name`,
                defaultMessage: name,
            },
            Component: async ()=>
                await import(/* webpackChunkName: "[request]" */ "./pages/App"),
            
            permissions: [],
        });

        app.createSettingSection({
            id: pluginId,
            intlLabel: {
                id: `${pluginId}.plugin.name`,
                defaultMessage: pluginPkg.strapi.name,
            },
        }, [{
            intlLabel: {
                id: `${pluginId}.plugin.name`,
                defaultMessage: "Configuration",
            },
            id: pluginId,
            to: `/settings/${pluginId}`,
            Component: async ()=>
                await import(/* webpackChunkName: "stripe-page" */ "./pages/Settings"),
        }]);

        app.registerPlugin({
            name,
            id: pluginId,
            isReady: false,
            initializer: Initializer
        });
    },

    bootstrap(app: any)
    {

    },

    async registerTrads(app: any)
    {
        const {locales} = app;
        const importedTrads = await Promise.all((locales as any[]).map((locale)=>
        {
            return import(`./translations/${locale}.json`)
                .then(({default: data}) => {
                    return {
                        data: prefixPluginTranslations(data, pluginId),
                        locale,
                    };
                })
                .catch(() => {
                    return {
                        data: {},
                        locale,
                    };
                });
        }));

        return Promise.resolve(importedTrads);
    }
};