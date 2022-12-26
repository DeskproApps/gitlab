import { createSearchParams } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import { proxyFetch } from "@deskpro/app-sdk";
import { REST_URL, placeholders } from "./constants";
import { GitLabError } from "./GitLabError";
import type { ParamKeyValuePair } from "react-router-dom";
import type { Request } from "../../types";

const baseRequest: Request = async (client, {
    url,
    rawUrl,
    data = {},
    method = "GET",
    queryParams = {},
    headers: customHeaders
}) => {
    const dpFetch = await proxyFetch(client);

    const baseUrl = rawUrl ? rawUrl : `${REST_URL}${url}`;
    const parsedQueryParams = Array.isArray(queryParams)
        ? queryParams
        : Object.keys(queryParams).map<ParamKeyValuePair>((key) => ([key, queryParams[key]]));
    const params = `${isEmpty(parsedQueryParams) ? "" : `?${createSearchParams(parsedQueryParams)}`}`;
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
        /** ToDo: handle error
         * 401 - { message: "401 Unauthorized" }
         * 401 (invalid_token) - {"error":"invalid_token","error_description":"Token is expired. You can either do re-authorization or token refresh."}
         * 403 (scope) -
         * */
        throw new GitLabError({ message: await res.text() });
    }

    return await res.json();
};

export { baseRequest };
