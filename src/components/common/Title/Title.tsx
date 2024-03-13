import { FC, ComponentType, ReactNode } from "react";
import styled   from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { H1, Stack, Button } from "@deskpro/deskpro-ui";
import { GitlabLink } from "../GitlabLink";

type Props = {
    title: ReactNode,
    link?: string,
    onClick?: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    as?: ComponentType<any>|string|any,
    marginBottom?: number,
};

const Heading = styled(H1)`
    width: calc(100% - 50px);
`;

const Title: FC<Props> = ({
    link,
    title,
    as = H1,
    onClick,
    marginBottom = 14,
}) => (
    <Stack align="center" justify="space-between" gap={6} style={{ marginBottom }}>
        <Heading as={as}>
            {title}&nbsp;
            {onClick && (
                <Button icon={faPlus} minimal noMinimalUnderline onClick={onClick}/>
            )}
        </Heading>
        {link && <GitlabLink href={link} />}
    </Stack>
);

export { Title };
