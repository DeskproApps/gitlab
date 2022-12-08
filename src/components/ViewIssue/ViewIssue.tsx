import { HorizontalDivider } from "@deskpro/app-sdk";
import { Info } from "./Info";
import { Comments } from "./Comments";
import { MergeRequests } from "./MergeRequests";
import type { FC } from "react";
import type { Props } from "./types";

const ViewIssue: FC<Props> = ({ issue, project, comments, mergeRequests }) => {
    return (
        <>
            <Info issue={issue} project={project} />
            <HorizontalDivider style={{ margin: "10px 0" }} />
            <MergeRequests mergeRequests={mergeRequests} />
            <HorizontalDivider style={{ margin: "10px 0" }} />
            <Comments comments={comments} />
        </>
    );
};

export { ViewIssue };
