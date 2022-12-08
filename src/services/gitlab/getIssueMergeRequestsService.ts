import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue } from "./types";

const getIssueMergeRequestsService = (
    client: IDeskproClient,
    projectId: Issue["project_id"]|string,
    issueIid: Issue["iid"]|string,
) => {
    return baseRequest(client, {
        url: `/projects/${projectId}/issues/${issueIid}/related_merge_requests`,
    });
};

export { getIssueMergeRequestsService };
