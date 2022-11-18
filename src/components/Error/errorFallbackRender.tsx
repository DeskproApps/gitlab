import { FC } from "react";
import { FallbackProps } from "react-error-boundary";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Button, Stack } from "@deskpro/app-sdk";
import { ErrorBlock } from "./ErrorBlock";

type Props = Omit<FallbackProps, "error"> & {
    error: Error,
};

const errorFallbackRender: FC<Props> = ({ resetErrorBoundary, error }) => {
    const message = "There was an error!";
    const nativeErrorMessage = error.message;

    // eslint-disable-next-line no-console
    console.error(nativeErrorMessage);

    return (
        <ErrorBlock
            text={(
                <Stack gap={6} vertical style={{ padding: "8px" }}>
                    {message}
                    <Button
                        text="Reload"
                        icon={faRefresh}
                        intent="secondary"
                        onClick={resetErrorBoundary}
                    />
                </Stack>
            )}
        />
    );
};

export { errorFallbackRender };
