import { FC, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import {
    H2,
    P1,
    Stack,
    Button,
    LoadingSpinner,
    useDeskproAppTheme,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";

const AdminPage: FC = () => {
    const { theme } = useDeskproAppTheme();
    const [callbackUrl, setCallbackUrl] = useState<string|null>(null);
    const key = useMemo(() => uuidv4(), []);

    useInitialisedDeskproAppClient((client) => {
        client.oauth2()
            .getAdminGenericCallbackUrl(key, /code=(?<token>[0-9a-f]+)/, /state=(?<key>.+)/)
            .then(({ callbackUrl }) => setCallbackUrl(callbackUrl));
    }, [key]);

    if (!callbackUrl) {
        return (<LoadingSpinner/>);
    }

    return (
        <>
            <H2 style={{ marginBottom: "5px" }}>Callback URL</H2>
            <Stack
                style={{ borderColor: theme.colors.brandShade40, color: theme.colors.grey100 }}
                justify="space-between"
                align="center"
            >
                <div style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", paddingRight: "15px" }}>
                    {callbackUrl}
                </div>
                <CopyToClipboard text={callbackUrl}>
                    <Button text="Copy" icon={faCopy} intent="secondary"/>
                </CopyToClipboard>
            </Stack>
            <P1 style={{ marginBottom: "16px", marginTop: "8px", color: theme.colors.grey80 }}>
                The callback URL will be required during Salesforce app setup
            </P1>
        </>
    )
};

export { AdminPage };
