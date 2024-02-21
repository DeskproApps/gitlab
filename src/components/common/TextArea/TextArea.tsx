import { forwardRef, Ref } from "react";
import { isNumber } from "lodash";
import styled from "styled-components";
import {
    TextAreaWithDisplay,
    TextAreaWithDisplayProps,
} from "@deskpro/deskpro-ui";

type Props = TextAreaWithDisplayProps & {
    minHeight?: number | string | "auto",
};

const TextArea = styled(
    forwardRef(({ minHeight, ...props }: Props, ref: Ref<HTMLTextAreaElement>) =>
        <TextAreaWithDisplay {...props} ref={ref} />
    )
)<Props>`
    min-height: ${({ minHeight = 100 }) => isNumber(minHeight) ? `${minHeight}px` : minHeight};
    align-items: flex-start;
    font-size: 12px;
    font-weight: 500;
    font-family: ${({ theme }) => theme.fonts.primary};
`;

export { TextArea };
