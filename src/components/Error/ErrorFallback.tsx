import { FC } from "react";
import { FallbackProps } from "react-error-boundary";
import { Stack } from "@deskpro/app-sdk";
import { ErrorBlock } from "./ErrorBlock";
import { Container } from "../common";

type Props = Omit<FallbackProps, "error"> & {
    error: Error,
};

const ErrorFallback: FC<Props> = ({ /*resetErrorBoundary, */error }) => {
    const message = "There was an error!";
    const nativeErrorMessage = error.message;

    // eslint-disable-next-line no-console
    console.error(nativeErrorMessage);

    return (
        <Container>
            <ErrorBlock
                text={(
                    <Stack gap={6} vertical style={{ padding: "8px" }}>
                        {message}
                        {/*<Button
                            text="Reload"
                            icon={faRefresh}
                            intent="secondary"
                            onClick={resetErrorBoundary}
                        />*/}
                    </Stack>
                )}
            />
        </Container>
    );
};

export { ErrorFallback };
