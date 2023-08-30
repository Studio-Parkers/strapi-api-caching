import {auth} from "@strapi/helper-plugin";

// Lib
import pluginId from "../pluginId";

export const getCachableItems = async (): Promise<Record<string, Array<any>>>=>
{
    const response = await fetch(`${process.env.STRAPI_ADMIN_BACKEND_URL}/${pluginId}/cachable-items`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${auth.getToken()}`,
            "Content-Type": "application/json",
        }
    });

    return await response.json();
};

export const getConfig = async (): Promise<Record<string, any>>=>
{
    const response = await fetch(`${process.env.STRAPI_ADMIN_BACKEND_URL}/${pluginId}/config`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${auth.getToken()}`,
            "Content-Type": "application/json",
        }
    });

    return await response.json();
};

export const updateConfig = async (config: Record<string, any>): Promise<Record<string, any>>=>
{
    const response = await fetch(`${process.env.STRAPI_ADMIN_BACKEND_URL}/${pluginId}/config`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${auth.getToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(config)
    });

    return await response.json();
};

export const getCaches = async (): Promise<any[]>=>
{
    const response = await fetch(`${process.env.STRAPI_ADMIN_BACKEND_URL}/${pluginId}/caches`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${auth.getToken()}`,
            "Content-Type": "application/json",
        }
    });

    return await response.json();
};