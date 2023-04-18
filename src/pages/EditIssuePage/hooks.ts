import get from "lodash.get";
import isEmpty from "lodash.isempty";
import { useQueryWithClient } from "../../hooks";
import { getIssueService, getProjectService } from "../../services/gitlab";
import { QueryKey } from "../../query";
import type { Issue, Project } from "../../services/gitlab/types";

type UseLoadIssueDeps = (
    issueIid?: Issue["iid"],
    projectId?: Project["id"],
) => {
    isLoading: boolean,
    issue: Issue,
    project: Project,
};

const useLoadIssueDeps: UseLoadIssueDeps = (issueIid, projectId) => {
    const issue = useQueryWithClient(
        [QueryKey.ISSUES, projectId, issueIid],
        (client) => getIssueService(client, projectId as Project["id"], issueIid as Issue["iid"]),
        { enabled: Boolean(projectId) && Boolean(issueIid) }
    );

    const project = useQueryWithClient<Project>(
        [QueryKey.PROJECTS, projectId],
        (client) => getProjectService(client, projectId as Project["id"]),
        {
            enabled: Boolean(projectId),
        },
    );

    return {
        isLoading: isEmpty(get(issue, ["data", 0]))
            || isEmpty(get(project, ["data"]))
            || [issue, project].every(({ isLoading }) => isLoading),
        issue: get(issue, ["data", 0]) as Issue,
        project: get(project, ["data"]) as Project,
    };
}

export { useLoadIssueDeps };
