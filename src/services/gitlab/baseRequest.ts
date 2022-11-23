import { createSearchParams } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import { proxyFetch } from "@deskpro/app-sdk";
import { REST_URL, placeholders } from "./constants";
import { GitLabError } from "./GitLabError";
import type { Request } from "../../types";

const baseRequest: Request = async (client, {
    url,
    data = {},
    method = "GET",
    queryParams = {},
    headers: customHeaders
}) => {
    const dpFetch = await proxyFetch(client);

    const baseUrl = `${REST_URL}${url}`;
    const params = `${isEmpty(queryParams) ? "" : `?${createSearchParams(queryParams)}`}`;
    const requestUrl = `${baseUrl}${params}`;
    const options: RequestInit = {
        method,
        headers: {
            "Authorization": `Bearer ${placeholders.TOKEN}`,
            ...customHeaders,
        },
    };

    if (data instanceof FormData) {
        options.body = data;
    } else if (data) {
        options.body = JSON.stringify(data);
        options.headers = {
            ...options.headers,
            "Content-Type": "application/json",
        };
    }

    const res = await dpFetch(requestUrl, options);

    if (res.status < 200 || res.status > 399) {
        throw new GitLabError({ message: await res.text() });
    }

    return await res.json();
};

export { baseRequest };
