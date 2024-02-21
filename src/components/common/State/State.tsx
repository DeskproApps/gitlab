import { match } from "ts-pattern";
import { capitalize } from "lodash";
import { Pill, useDeskproAppTheme } from "@deskpro/app-sdk";
import type { FC } from "react";

type Props = { state?: "opened"|"closed"|"merged" };

const State: FC<Props> = ({ state }) => {
    const { theme } = useDeskproAppTheme();
    const [bg, label] = match(state)
        .with("opened", () => [theme.colors.green100, "Open"])
        .with("closed", () => [theme.colors.cyan100, "Closed"])
        .with("merged", () => [theme.colors.amethyst100, "Merged"])
        .otherwise(() => [theme.colors.grey80, capitalize(state)])

    return (
        <Pill
            label={label}
            textColor={theme.colors.white}
            backgroundColor={bg}
        />
    );
};

export { State };
