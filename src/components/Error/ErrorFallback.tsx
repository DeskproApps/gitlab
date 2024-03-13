import { useCallback } from "react";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { match } from "ts-pattern";
import { useNavigate } from "react-router-dom";
import { FallbackProps } from "react-error-boundary";
import { Stack } from "@deskpro/deskpro-ui";
import { GitLabError } from "../../services/gitlab";
import { ErrorBlock } from "./ErrorBlock";
import { Container, Button } from "../common";
import type { FC } from "react";

type Props = Omit<FallbackProps, "error"> & {
    error: Error|GitLabError,
};

const ErrorFallback: FC<Props> = ({ resetErrorBoundary, error }) => {
    const navigate = useNavigate();

    let message = "There was an error!";
    let button = null;
    const nativeErrorMessage = error;

    const toLogin = useCallback(() => {
        resetErrorBoundary();
        navigate("/login");
    }, [navigate, resetErrorBoundary]);

    if (error instanceof GitLabError) {
        const { status } = error;

        match(status)
            .with(401, () => {
                message = "Authentication information is not valid or is missing";
                button = <Button text="Log In" intent="secondary" onClick={toLogin} />;
            })
            .with(403, () => {
                message = "Please ensure that the app has been granted all necessary permissions in GitLab";
                button = <Button text="Reload" icon={faRefresh} intent="secondary" onClick={resetErrorBoundary}/>;
            })
            .otherwise(() => {
                message = "There was an error!";
                button = <Button text="Reload" icon={faRefresh} intent="secondary" onClick={resetErrorBoundary}/>;
            });
    }

    // eslint-disable-next-line no-console
    console.error(nativeErrorMessage);

    return (
        <Container>
            <ErrorBlock
                text={(
                    <Stack gap={6} vertical style={{ padding: "8px" }}>
                        {message}
                        {button}
                    </Stack>
                )}
            />
        </Container>
    );
};

export { ErrorFallback };
