import {Trash, Refresh} from "@strapi/icons";
import React, {useEffect, useState} from "react";
import {Layout, Main, HeaderLayout, Button, Typography, ContentLayout, Table, Thead, Th, Tr, Tbody, Td, BaseCheckbox, IconButton} from "@strapi/design-system";

// Lib
import {deleteCaches, getCaches} from "../../utils/api";

const HomePage = ()=>
{
    const [caches, setCaches] = useState<any[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [selected, setSelected] = useState<boolean[]>([]);
    const selectedCount = selected.reduce((results, current)=> results + (current ? 1 : 0), 0);

    const loadCaches = async (): Promise<void>=>
    {
        setLoading(true);
        try {setCaches(await getCaches());}
        catch(error){}

        toggleAll();
        setLoading(false);
    };
    
    const toggleAll = (): void=>
        setSelected(new Array(caches.length).fill(selectAll));

    const setCheckboxValue = (index: number, value: boolean): void=>
    {
        const tmp = JSON.parse(JSON.stringify(selected));
        tmp[index] = value;
        setSelected(tmp);
    };

    const deleteSelected = async ()=>
    {
        const targets = caches.filter((cache, i)=> selected[i]).map(cache=> cache.file);
        await deleteCaches(targets);
        await loadCaches();
    };

    useEffect(toggleAll, [selectAll]);
    useEffect(()=> void(loadCaches()), []);

    const DeleteButton = ()=>
        <Button loading={isLoading} disabled={selectedCount === 0} onClick={deleteSelected} startIcon={<Trash />}>Delete {selectedCount} selected</Button>

    const RefreshButton = ()=>
        <Button startIcon={<Refresh />} onClick={loadCaches}>Refresh</Button>;

    return (
        <Layout>
            <HeaderLayout title="API Caches" subtitle="Overview" secondaryAction={<RefreshButton />} primaryAction={<DeleteButton />} />

            <Main>
                <ContentLayout>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th><BaseCheckbox value={selectAll} onValueChange={setSelectAll} /></Th>
                                <Th><Typography>Route</Typography></Th>
                                <Th><Typography>File</Typography></Th>
                                <Th><Typography>Size</Typography></Th>
                                <Th><Typography>Last modified</Typography></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                        {
                            caches.map((cache, i)=>
                                <Tr key={`cache-${cache.file}`} shadow="tableShadow" background="neutral0" padding={6} hasRadius>
                                    <Td><BaseCheckbox value={selected[i]} onValueChange={e=> setCheckboxValue(i, e)} /></Td>
                                    <Td><Typography>{cache.route}</Typography></Td>
                                    <Td><Typography>{cache.file}</Typography></Td>
                                    <Td><Typography>{cache.size}</Typography></Td>
                                    <Td><Typography>{new Date(cache.date).toLocaleDateString("en-UK", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"})}</Typography></Td>
                                </Tr>       
                            )
                        }
                        </Tbody>
                    </Table>
                </ContentLayout>
            </Main>
        </Layout>
    );
};

export default HomePage;