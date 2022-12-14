import get from "lodash/get";
import { useQueryWithClient } from "../../hooks";
import { getIssueService } from "../../services/gitlab";
import { QueryKey } from "../../query";
import type { Issue, Project } from "../../services/gitlab/types";

type UseLoadIssueDeps = (
    issueIid?: Issue["iid"],
    projectId?: Project["id"],
) => {
    isLoading: boolean,
    issue: Issue,
};

const useLoadIssueDeps: UseLoadIssueDeps = (issueIid, projectId) => {
    const issue = useQueryWithClient(
        [QueryKey.ISSUES, projectId, issueIid],
        (client) => getIssueService(client, projectId as Project["id"], issueIid as Issue["iid"]),
        { enabled: Boolean(projectId) && Boolean(issueIid) }
    );

    return {
        isLoading: [
            issue,
        ].every(({ isLoading }) => isLoading),
        issue: get(issue, ["data", 0]) as Issue,
    };
}

export { useLoadIssueDeps };
