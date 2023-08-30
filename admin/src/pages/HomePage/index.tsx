import React, {useEffect, useState} from "react";
import {Layout, Main, HeaderLayout, Box, Flex, Typography, ContentLayout} from "@strapi/design-system";

// Lib
import {getCaches} from "../../utils/api";

const HomePage = ()=>
{
    const [caches, setCaches] = useState<any[]>([]);

    const loadCaches = async ()=>
    {
        try {setCaches(await getCaches());}
        catch(error){}
    };

    useEffect(()=> void(loadCaches()), []);

    return (
        <Layout>
            <HeaderLayout title="API Caches" subtitle="Overview" />

            <Main>
                <ContentLayout>
                {
                    caches.map(cache=>
                        <Box shadow="tableShadow" background="neutral0" padding={6} hasRadius>
                            <Flex gap={5}>
                                <Typography>{cache.route}</Typography>
                                <Typography>{cache.file}</Typography>
                                <Typography>{cache.size}</Typography>
                                <Typography>{new Date(cache.date).toLocaleDateString("en-UK", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"})}</Typography>
                            </Flex>
                        </Box>       
                    )
                }
                </ContentLayout>
            </Main>
        </Layout>
    );
};

export default HomePage;