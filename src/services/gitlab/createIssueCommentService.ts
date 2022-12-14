import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Project, IssueComment } from "./types";

type Data = {
    body: string,
};

const createIssueCommentService = (
    client: IDeskproClient,
    projectId: Project["id"]|string,
    issueIid: Issue["iid"]|string,
    data: Data,
) => {
    return baseRequest<IssueComment>(client, {
        url: `/projects/${projectId}/issues/${issueIid}/notes`,
        method: "POST",
        data,
    });
};

export { createIssueCommentService };
