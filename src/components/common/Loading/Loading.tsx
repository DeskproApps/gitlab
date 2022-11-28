import { FC } from "react";
import { Stack, Spinner } from "@deskpro/deskpro-ui";
import type { SpinnerProps } from "@deskpro/deskpro-ui";

const Loading: FC<SpinnerProps> = (props) => (
    <Stack justify="center" style={{ margin: 8 }}>
        <Spinner {...props} />
    </Stack>
);

export { Loading };
