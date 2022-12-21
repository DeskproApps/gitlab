import {
    HorizontalDivider,
} from "@deskpro/app-sdk";
import { format } from "../../utils/date";
import { isLast } from "../../utils";
import {
    Title,
    State,
    Container,
    TwoProperties,
} from "../common";
import type { FC } from "react";
import type { MergeRequest } from "../../services/gitlab/types";
import type { Props } from "./types";

const MR: FC<MergeRequest & { isLast: boolean }> = ({ isLast, title, web_url, state, created_at }) => {
    return (
        <>
            <Title title={title} link={web_url} marginBottom={0} />
            <TwoProperties
                leftText={<State state={state} />}
                rightText={format(created_at)}
            />
            {isLast && <HorizontalDivider style={{ margin: "10px 0" }} />}
        </>
    );
};

const MergeRequests: FC<Pick<Props, "mergeRequests">> = ({ mergeRequests }) => {
    const count = Array.isArray(mergeRequests) ? mergeRequests.length : 0;
    return (
        <Container>
            <Title title={`Related Merge Requests (${count})`}/>

            {Boolean(count) && mergeRequests.map((mr, idx) => (
                <MR key={mr.id} isLast={isLast(mergeRequests, idx)} {...mr} />
            ))}
        </Container>
    );
};

export { MergeRequests };
