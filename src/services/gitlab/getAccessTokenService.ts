import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { placeholders } from "./constants";
import type { OAuthToken } from "./types";

const getAccessTokenService = async (
    client: IDeskproClient,
    accessCode: string,
    callbackUrl: string
) => {
    return baseRequest<OAuthToken>(client, {
        rawUrl: `${placeholders.gitlab_instance_url}/oauth/token`,
        method: "POST",
        queryParams: {
            grant_type: "authorization_code",
            client_id: placeholders.app_id,
            client_secret: placeholders.client_secret,
            code: accessCode,
            redirect_uri: callbackUrl,
        },
    });
};

export { getAccessTokenService };
