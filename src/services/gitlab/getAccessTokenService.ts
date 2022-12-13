import { createSearchParams } from "react-router-dom";
import { proxyFetch, IDeskproClient } from "@deskpro/app-sdk";
import { placeholders } from "./constants";
import type { OAuthToken } from "./types";

const getAccessTokenService = async (
    client: IDeskproClient,
    accessCode: string,
    callbackUrl: string
): Promise<OAuthToken> => {
    const url = `${placeholders.gitlab_instance_url}/oauth/token?${createSearchParams([
        ["grant_type", "authorization_code"],
        ["client_id", placeholders.app_id],
        ["client_secret", placeholders.client_secret],
        ["code", accessCode],
        ["redirect_uri", callbackUrl],
    ])}`;

    const dpFetch = await proxyFetch(client);
    const res = await dpFetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (res.status < 200 || res.status >= 400) {
        throw new Error(`POST ${url}: Response Status [${res.status}]`);
    }

    return await res.json();
};

export { getAccessTokenService };
