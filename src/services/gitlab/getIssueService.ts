import { createSearchParams } from "react-router-dom";
import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue } from "./types";

const getIssueService = (
    client: IDeskproClient,
    projectId: Issue["project_id"]|string,
    issueIid: Issue["iid"]|string,
) => {
    return baseRequest<Issue[]>(client, {
        url: `/projects/${projectId}/issues?${createSearchParams([
            ["iids[]", `${issueIid}`],
            ["with_labels_details", `true`],
        ])}`,
    });
};

export { getIssueService };
