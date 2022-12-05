import { FC } from "react";
import styled from "styled-components";
import { Property } from "./Property";
import type { Props as PropertyProps } from "./types";

export type Props = {
    leftLabel: PropertyProps["label"],
    leftText: PropertyProps["text"],
    rightLabel: PropertyProps["label"],
    rightText: PropertyProps["text"],
};

const Container = styled.div`
    width: 100%;
    margin-bottom: -1px;
`;

const Side = styled.div`
    display: inline-block;
    width: calc(49% - 6px);
`;

const Divider = styled.div`
    display: inline-block;
    width: 1px;
    height: 2em;
    background-color: ${({ theme }) => theme.colors.grey20};
    margin: 0 6px;
`;


const TwoProperties: FC<Props> = ({ leftLabel, leftText, rightLabel, rightText }) => (
    <Container>
        <Side>
            <Property
                label={leftLabel}
                text={leftText}
            />
        </Side>
        <Divider />
        <Side>
            <Property
                label={rightLabel}
                text={rightText}
            />
        </Side>
    </Container>
);

export { TwoProperties };
