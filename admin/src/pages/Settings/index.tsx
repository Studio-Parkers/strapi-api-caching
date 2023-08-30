import {Helmet} from "react-helmet";
import {Check} from "@strapi/icons";
import {useNotification} from "@strapi/helper-plugin";
import React, {useState, useEffect, useRef} from "react";
import {Layout, Button, HeaderLayout, ContentLayout, Box, Main, TextInput, Accordion, AccordionToggle, AccordionContent, Loader} from "@strapi/design-system";

// Lib
import {getConfig, getCachableItems, updateConfig} from "../../utils/api";

// Components
import RouteRow from "../../components/settings/RouteRow";

const HomePage = ()=>
{
    const notification = useNotification();
    const config = useRef({cacheFolder: "/var/cache", cache: {}});

    const [isLoading, setLoading] = useState<boolean>(false);

    const [cacheFolder, setCacheFolder] = useState(config.current.cacheFolder);
    const [cachableItems, setCachableItems] = useState<Record<string, {expanded: boolean, routes: Array<{cache: boolean, query: boolean, path: string, method: string}>}>>({});

    const loadConfig = async (): Promise<void>=>
    {
        let configResponse;
        try {configResponse = await getConfig();}
        catch(error) {
            notification({
                type: "warning",
                message: {
                  id: "config-fetch-error",
                  defaultMessage: "Error while fetching the configurations",
                }
            });
        }
        
        config.current = {...config.current, ...configResponse};
        setCacheFolder(config.current.cacheFolder);
    };

    const loadCachableItems = async (): Promise<void>=>
    {
        let items;
        try {items = await getCachableItems();}
        catch(error) {items = {};}

        const result = {};
        for (let name in items)
        {
            result[name] = {expanded: false, routes: []};
            for (let i in items[name])
            {
                const routeConfig = config.current.cache[items[name][i].path] ?? {cache: false, query: false};
                result[name].routes.push({...items[name][i], ...routeConfig});
            }
        }

        setCachableItems(result);
    };

    const handelSave = async ()=>
    {
        console.log({
            cacheFolder,
            cache: Object.keys(cachableItems).reduce((result, name)=>
            {
                for (let i in cachableItems[name].routes)
                {
                    const route = cachableItems[name].routes[i];
                    result[route.path] = {cache: route.cache, query: route.query};
                }
                return result;
            }, {})
        });
        updateConfig({
            cacheFolder,
            cache: Object.keys(cachableItems).reduce((result, name)=>
            {
                for (let i in cachableItems[name].routes)
                {
                    const route = cachableItems[name].routes[i];
                    result[route.path] = {cache: route.cache, query: route.query};
                }
                return result;
            }, {})
        });
    };

    const updatePreference = (name: string, index: number, value: {cache: boolean, query: boolean})=>
    {
        const tmp = JSON.parse(JSON.stringify(cachableItems));
        tmp[name].routes[index].cache = value.cache;
        tmp[name].routes[index].query = value.query;
        setCachableItems(tmp);
    }

    const onMounted = async ()=>
    {
        setLoading(true);
        await loadConfig();
        await loadCachableItems();
        setLoading(false);
    };

    useEffect(()=> void (onMounted()), []);

    const HeaderLayoutAction = ()=>
        <Button startIcon={<Check />} onClick={handelSave} loading={isLoading}>Save</Button>

    return (
        <Layout>
            <Helmet title="API Caching Configuration" />
            <Main aria-busy={false}>
                <HeaderLayout title="API Caching configuration" primaryAction={<HeaderLayoutAction />} />

                {isLoading && <Loader />}

                {
                    !isLoading && 
                    <ContentLayout>
                        <Box shadow="tableShadow" background="neutral0" padding={6} hasRadius marginBottom={6}>
                            <TextInput label="cache dir" hint="Absolute path to the folder you want to store the cache files" value={cacheFolder} onChange={e=> setCacheFolder(e.target.value)} />
                        </Box>

                        <h2 style={{fontSize: "1.5rem", fontWeight: 600, color: "#FFFFFF"}}>Caching options</h2>
                        <p style={{fontSize: "1rem", margin: "1rem 0", color: "#FFFFFF"}}>Enable caching per route and enable query if you want to cache query parameters.</p>

                        {
                            Object.keys(cachableItems).map(name=> 
                                <Accordion key={`accordion-${name}`} expanded={cachableItems[name].expanded} onToggle={()=> setCachableItems({...cachableItems, [name]: {routes: cachableItems[name].routes, expanded: !cachableItems[name].expanded}})}>
                                    <AccordionToggle title={name} description={`Set caching preferences for ${name}`} />
                                        <AccordionContent>
                                            <Box shadow="tableShadow" background="neutral100" paddingLeft={6} paddingRight={6} paddingBottom={6} hasRadius>
                                                {cachableItems[name].routes.map((route, j)=> <RouteRow key={`route-row-${route.method}-${route.path}`} route={route} cache={route.cache} query={route.query} onChange={e=> updatePreference(name, j, e)} />)}
                                            </Box>
                                        </AccordionContent>
                                </Accordion>
                            )
                        }
                    </ContentLayout>
                }
            </Main>
        </Layout>
    );
};

export default HomePage;