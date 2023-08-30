import React from "react";
import {Box, Typography, Flex, Badge, Checkbox} from "@strapi/design-system";

export default ({route, cache, query, onChange})=>
{
    const updateValue = (name, value)=>
        onChange({...{cache, query}, [name]: value});

    return (
        <Flex gap={3}>
            <Flex>
                <Badge textColor="secondary500" backgroundColor="neutral150">{route.method}</Badge>
                <Box paddingLeft={3} paddingRight={3} background="neutral0" borderColor="neutral200"><Typography>{route.path}</Typography></Box>
            </Flex>  

            <Checkbox value={cache} onValueChange={e=> updateValue("cache", e)}>Cache</Checkbox>
            <Checkbox value={query} onValueChange={e=> updateValue("query", e)}>Cache query params</Checkbox>
        </Flex>
    );
};