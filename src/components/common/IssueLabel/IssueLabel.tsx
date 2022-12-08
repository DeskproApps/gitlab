import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Tag } from "@deskpro/deskpro-ui";
import type { FC } from "react";

type Props = {
    name: string,
    color: string,
    text_color: string,
}

const IssueLabel: FC<Props> = ({ name, color, text_color  }) => (
    <Tag
        color={{
            borderColor: color,
            backgroundColor: `${color}cc`,
            textColor: text_color,
        }}
        label={name}
        closeIcon={faTimes}
        withClose={false}
    />
);

export { IssueLabel };
