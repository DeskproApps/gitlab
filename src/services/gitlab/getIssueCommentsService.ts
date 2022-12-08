import { createSearchParams } from "react-router-dom";
import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue } from "./types";

const getIssueCommentsService = (
    client: IDeskproClient,
    projectId: Issue["project_id"]|string,
    issueIid: Issue["iid"]|string,
) => {
    return baseRequest(client, {
        url: `/projects/${projectId}/issues/${issueIid}/notes?${createSearchParams([
            ["sort", "desc"],
            ["order_by", "updated_at"],
        ])}`,
    });
};

export { getIssueCommentsService };
