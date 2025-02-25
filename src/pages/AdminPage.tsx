import { FC, useState } from 'react';
import { createSearchParams } from 'react-router-dom';
import styled from "styled-components";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { P1, H2, Input, IconButton } from "@deskpro/deskpro-ui";
import {
    LoadingSpinner,
    useDeskproAppTheme,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { Settings } from '../types';

const Label = styled(H2)`
    margin-bottom: 5px;
`;

const Description = styled(P1)`
    margin-top: 8px;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.grey80};
`;

const AdminPage: FC = () => {
    const { context } = useDeskproLatestAppContext<unknown, Settings>();
    const { theme } = useDeskproAppTheme();
    const [callbackUrl, setCallbackUrl] = useState<string|null>(null);
    const [isCopy, setIsCopy] = useState<boolean>(false);

    const onClickCopy = () => {
        setIsCopy(true);
        setTimeout(() => setIsCopy(false), 2000);
    };

    useInitialisedDeskproAppClient(client => {
        const appID = context?.settings.app_id;
        const gitlabInstanceURL = context?.settings.gitlab_instance_url;

        client.startOauth2Local(
            ({ callbackUrl, state }) => {
                setCallbackUrl(callbackUrl);

                return `${gitlabInstanceURL}/oauth/authorize?${createSearchParams([
                    ['client_id', appID ?? ''],
                    ['redirect_uri', callbackUrl],
                    ['response_type', 'code'],
                    ['state', state],
                    ['scope', ['api'].join(' ')]
                ])}`;
            },
            /^$/,
            async () => ({data: {access_token: ''}}),
            {
                pollInterval: 10000,
                timeout: 600
            }
        );
    }, []);

    if (!callbackUrl) {
        return (<LoadingSpinner/>);
    }

    return (
        <>
            <Label>Callback URL</Label>
            <Input
                disabled={true}
                value={callbackUrl}
                rightIcon={(
                    <CopyToClipboard text={callbackUrl}>
                        <IconButton
                            minimal
                            onClick={onClickCopy}
                            icon={isCopy ? faCheck : faCopy}
                            title="Copy"
                            {...(isCopy ? { style: { color: theme.colors.green100 }} : {})}
                        />
                    </CopyToClipboard>
                )}
            />
            <Description>The callback URL will be required during GitLab app setup</Description>
        </>
    )
};

export { AdminPage };