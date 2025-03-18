import { useState, useCallback, useRef } from 'react';
import { createSearchParams } from "react-router-dom";
import {
    IOAuth2,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient
} from "@deskpro/app-sdk";
import {
    placeholders,
    getAccessTokenService,
    getCurrentUserService,
} from "../../services/gitlab";
import { Maybe, Settings } from '../../types';
import { GLOBAL_CLIENT_ID } from '../../constants';

type UseLogin = () => {
    isAuth: boolean,
    authLink: string,
    isLoading: boolean,
    onSignIn: () => void,
    error: Maybe<Error>,
};

const useLogin: UseLogin = () => {
    const { context } = useDeskproLatestAppContext<unknown, Settings>();
    const callbackURLRef = useRef('');
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [authLink, setAuthLink] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Maybe<Error>>(null);
    const [isPolling, setIsPolling] = useState(false);
    const [oAuth2Context, setOAuth2Context] = useState<IOAuth2 | null>(null);

    useInitialisedDeskproAppClient(async client => {
        if (context?.settings.use_advanced_connect === undefined) {
            return;
        };

        const appID = context.settings.app_id;
        const gitlabInstanceURL = context.settings.gitlab_instance_url;
        const mode = context?.settings.use_advanced_connect ? 'local' : 'global';

        if (mode === 'local' && typeof appID !== 'string') {
            return;
        };

        const oauth2Response = mode === 'global' ? await client.startOauth2Global(GLOBAL_CLIENT_ID) : await client.startOauth2Local(
            ({ callbackUrl, state }) => {
                callbackURLRef.current = callbackUrl;

                return `${gitlabInstanceURL}/oauth/authorize?${createSearchParams([
                    ['client_id', appID],
                    ['redirect_uri', callbackUrl],
                    ['response_type', 'code'],
                    ['state', state],
                    ['scope', ['api'].join(' ')]
                ])}`;
            },
            /code=(?<code>[0-9a-f]+)/,
            async code => {
                const { access_token } = await getAccessTokenService(client, code, callbackURLRef.current);

                return {
                    data: { access_token }
                };
            }
        );

        setAuthLink(oauth2Response.authorizationUrl);
        setOAuth2Context(oauth2Response);
        setError(null);
    }, [setAuthLink, context?.settings.use_advanced_connect, context?.settings.app_id]);

    useInitialisedDeskproAppClient(client => {
        if (!oAuth2Context) {
            return;
        };

        const startPolling = async () => {
            try {
                const pollResult = await oAuth2Context.poll();
                const { isSuccess, errors } = await client.setUserState(placeholders.TOKEN_PATH, pollResult.data.access_token, { backend: true });

                if (!isSuccess) {
                    throw new Error(errors.join(', '));
                };

                const user = await getCurrentUserService(client);

                if (user.id) {
                    setIsAuth(true);
                } else {
                    setError(new Error("Can't Find Current User"));
                };
            } catch (error) {
                setError(error instanceof Error ? error : new Error('Unknown Error'));
            } finally {
                setIsPolling(false);
                setIsLoading(false);
            };
        };

        if (isPolling) {
            startPolling();
        };
    }, [oAuth2Context, isPolling]);

    const onSignIn = useCallback(() => {
        setIsLoading(true);
        setIsPolling(true);
        window.open(authLink, '_blank');
    }, [setIsLoading, authLink]);

    return { isAuth, error, authLink, onSignIn, isLoading };
};

export { useLogin };