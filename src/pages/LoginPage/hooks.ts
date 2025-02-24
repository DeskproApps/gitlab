import { useState, useCallback, useRef } from 'react';
import { createSearchParams } from "react-router-dom";
import {
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient
} from "@deskpro/app-sdk";
import {
    placeholders,
    getAccessTokenService,
    getCurrentUserService,
} from "../../services/gitlab";
import { Maybe, Settings } from '../../types';

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

    useInitialisedDeskproAppClient(async client => {
        if (context?.settings.use_deskpro_saas === undefined) {
            return;
        };

        const appID = context.settings.app_id;
        const gitlabInstanceURL = context.settings.gitlab_instance_url;
        const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

        if (mode === 'local' && typeof appID !== 'string') {
            return;
        };

        const oauth2 = mode === 'global' ? await client.startOauth2Global('ca0ab63635d436b67910d10bab604c76de27fd8ef05e4bf78abb27caac282f0e') : await client.startOauth2Local(
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

        setAuthLink(oauth2.authorizationUrl);
        setError(null);

        try {
            const pollResult = await oauth2.poll();
            const { isSuccess, errors } = await client.setUserState(placeholders.TOKEN_PATH, pollResult.data.access_token, {backend: true});

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
            setIsLoading(false);
        };
    }, [setAuthLink, context?.settings.use_deskpro_saas, context?.settings.app_id]);

    const onSignIn = useCallback(() => {
        setIsLoading(true);
        window.open(authLink, '_blank');
    }, [setIsLoading, authLink]);

    return { isAuth, error, authLink, onSignIn, isLoading };
};

export { useLogin };