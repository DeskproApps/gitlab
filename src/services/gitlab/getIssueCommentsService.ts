import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type {Issue, IssueComment} from "./types";

const getIssueCommentsService = (
    client: IDeskproClient,
    projectId: Issue["project_id"]|string,
    issueIid: Issue["iid"]|string,
) => {
    return baseRequest<IssueComment[]>(client, {
        url: `/projects/${projectId}/issues/${issueIid}/notes`,
        queryParams: {
            sort: "desc",
            order_by: "updated_at",
        },
    });
};

export { getIssueCommentsService };
