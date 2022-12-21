import type {
    Issue,
    Project,
    IssueComment,
    MergeRequest,
} from "../../services/gitlab/types";

export type Props = {
    issue: Issue,
    project: Project,
    comments: IssueComment[],
    mergeRequests: MergeRequest[],
    onCreateIssueComment: () => void,
};
