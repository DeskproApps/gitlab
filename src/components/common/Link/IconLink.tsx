import styled from "styled-components";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@deskpro/deskpro-ui";
import type { FC } from "react";

const StyledLink = styled.a`
    color: ${({ theme }) => theme.colors.grey40};
    font-size: 10px;
`;

const IconLink: FC<{ href: string }> = ({ href }) => (
    <StyledLink href={href} target="_blank">
        <Icon icon={faArrowUpRightFromSquare} />
    </StyledLink>
);

export { IconLink };
