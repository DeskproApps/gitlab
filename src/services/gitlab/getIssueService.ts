import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue } from "./types";

const getIssueService = (
    client: IDeskproClient,
    issueId: string,
) => {
    return baseRequest<Issue>(client, {
        url: `/issues/${issueId}`,
    });
};

export { getIssueService };
