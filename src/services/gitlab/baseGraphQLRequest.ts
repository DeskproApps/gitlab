import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { placeholders, GRAPHQL_URL } from "./constants";
import type { Request } from "../../types";

const baseGraphQLRequest: Request = async (
    client: IDeskproClient,
    { query, variables = {} },
) => {
    const dpFetch = await proxyFetch(client);

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${placeholders.TOKEN}`
    };

    const res = await dpFetch(GRAPHQL_URL, {
        headers,
        method: "POST",
        body: JSON.stringify({ query, variables }),
    });

    if (res.status < 200 || res.status >= 400) {
        throw new Error(`${GRAPHQL_URL}: Response Status [${res.status}]`);
    }

    try {
        const response = await res.json();

        if (response?.errors?.length) {
            return Promise.reject(response?.errors);
        }

        return response.data;
    } catch (e) {
        return {};
    }
};

export { baseGraphQLRequest };
