import { FC, ReactNode, isValidElement } from "react";
import styled from "styled-components";
import { P5, TSpan } from "@deskpro/deskpro-ui";
import type { Props } from "./types";

const Label: FC<{ children: ReactNode }> = ({ children, ...props }) => (
    <TSpan type="p8" themeColor="grey80" {...props}>{children}</TSpan>
);

const Container = styled.div<Props>`
  margin-bottom: ${({ marginBottom }) => `${marginBottom}px`};
`;

const Property: FC<Props> = ({ text, label, marginBottom = 10 }) => {
    let textBlock: ReactNode = "-";

    if (typeof text === "string" || typeof text === "number") {
        textBlock = (<P5>{text}</P5>);
    } else if (isValidElement(text)) {
        textBlock = (<div>{text}</div>);
    }

    return (
        <Container marginBottom={marginBottom}>
            {label && <Label>{label}</Label>}
            {textBlock && textBlock}
        </Container>
    );
}

export { Property };
