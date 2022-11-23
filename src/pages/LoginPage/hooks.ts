import { useState, useEffect, useMemo, useCallback } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import get from "lodash/get";
import {
    useDeskproAppClient,
    OAuth2StaticCallbackUrl,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import {
    placeholders,
    getAccessTokenService,
    getCurrentUserService,
} from "../../services/gitlab";
import { Maybe, TicketContext } from "../../types";

type UseLogin = () => {
    authLink: string,
    isLoading: boolean,
    onSignIn: () => void,
    error: Maybe<Error>,
};

const useLogin: UseLogin = () => {
    const navigate = useNavigate();
    const key = useMemo(() => uuidv4(), []);
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };

    const [authLink, setAuthLink] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [callback, setCallback] = useState<OAuth2StaticCallbackUrl|undefined>();
    const [error, setError] = useState<Maybe<Error>>(null);

    const appId = get(context, ["settings", "app_id"]);
    const callbackUrl = get(callback, ["callbackUrl"]);

    const onSignIn = useCallback(() => {
        if (!client || !callback?.poll || !callback.callbackUrl) {
            return;
        }

        setError(null);
        setTimeout(() => setIsLoading(true), 1000);
        callback.poll()
            .then(({ token }) => getAccessTokenService(client, token, callback.callbackUrl))
            .then(({ access_token }) => client.setUserState(placeholders.TOKEN_PATH, access_token))
            .then(({ isSuccess, errors }) => isSuccess ? Promise.resolve() : Promise.reject(errors))
            .then(() => getCurrentUserService(client))
            .then((data) => {
                if (get(data, ["currentUser", "id"], null)) {
                    navigate("/home");
                } else {
                    setError(new Error("Can't find current user"));
                    setIsLoading(false)
                }
            })
            .catch((err) => {
                setIsLoading(false);
                setError(err);
            });
    }, [callback, client, setIsLoading, navigate]);

    /** set callback */
    useEffect(() => {
        if (!callback && client) {
            client.oauth2()
                .getGenericCallbackUrl(key, /code=(?<token>[0-9a-f]+)/, /state=(?<key>.+)/)
                .then(setCallback);
        }
    }, [client, key, callback]);

    /** Set authLink */
    useEffect(() => {
        if (appId && callbackUrl && key) {
            setAuthLink(`https://gitlab.com/oauth/authorize?${createSearchParams({
                client_id: appId,
                redirect_uri: callbackUrl,
                response_type: "code",
                state: key,
                scope: ["read_api"].join(" "),
            })}`);
            setIsLoading(false);
        } else {
            setAuthLink("");
            setIsLoading(true);
        }
    }, [callbackUrl, key, appId]);

    return { error, authLink, onSignIn, isLoading };
};

export { useLogin };
