import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue } from "./types";

const getIssueService = (
    client: IDeskproClient,
    projectId: string,
    issueIid: string,
) => {
    return baseRequest<Issue>(client, {
        url: `/projects/${projectId}/issues/${issueIid}`,
    });
};

export { getIssueService };
