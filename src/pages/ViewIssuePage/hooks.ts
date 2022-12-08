import get from "lodash/get";
import { useQueryWithClient } from "../../hooks";
import {
    getIssueService,
    getProjectService,
    getIssueCommentsService,
    getIssueMergeRequestsService,
} from "../../services/gitlab";
import { QueryKey } from "../../query";
import type {
    Issue,
    Project,
    IssueComment,
    MergeRequest,
} from "../../services/gitlab/types";

type UseLoadIssueDeps = (
    issueIid?: Issue["iid"],
    projectId?: Issue["project_id"],
) => {
    isLoading: boolean,
    issue: Issue,
    project: Project,
    comments: IssueComment[],
    mergeRequests: MergeRequest[],
};

const useLoadIssueDeps: UseLoadIssueDeps = (issueIid, projectId) => {
    const issue = useQueryWithClient(
        [QueryKey.ISSUES, projectId, issueIid],
        (client) => getIssueService(client, projectId as Project["id"], issueIid as Issue["iid"]),
        { enabled: Boolean(projectId) && Boolean(issueIid) }
    );

    const project = useQueryWithClient(
        [QueryKey.PROJECTS, projectId],
        (client) => getProjectService(client, projectId as Project["id"]),
        { enabled: Boolean(projectId) },
    );

    const comments = useQueryWithClient(
        [QueryKey.ISSUES, QueryKey.COMMENTS, projectId, issueIid],
        (client) => getIssueCommentsService(client, projectId as Project["id"], issueIid as Issue["iid"]),
        {
            enabled: Boolean(projectId) && Boolean(issueIid),
            select: (data) =>  (Array.isArray(data) ? data : []).filter(({ system }) => !system),
        }
    );

    const mergeRequests = useQueryWithClient(
        [QueryKey.ISSUES, QueryKey.MERGE_REQUESTS, projectId, issueIid],
        (client) => getIssueMergeRequestsService(client, projectId as Project["id"], issueIid as Issue["iid"]),
        {
            enabled: Boolean(projectId) && Boolean(issueIid),
        }
    );

    return {
        isLoading: [
            issue,
            project,
            comments,
            mergeRequests,
        ].every(({ isLoading }) => isLoading),
        issue: get(issue, ["data", 0]) as Issue,
        project: get(project, ["data"]) as Project,
        comments: get(comments, ["data"], []) as IssueComment[],
        mergeRequests: get(mergeRequests, ["data"]) as MergeRequest[],
    }
};

export { useLoadIssueDeps };
