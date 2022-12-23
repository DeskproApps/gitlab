import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Project } from "./types";

type Data = {
    title?: string,
    description?: string,
    issue_type?: string,
    milestone_id?: number,
    assignee_id?: number,
    labels?: string,
};

const editIssueService = (
    client: IDeskproClient,
    projectId: Project["id"],
    issueIid: Issue["iid"],
    data: Data,
) => {
    return baseRequest<Issue>(client, {
        url: `/projects/${projectId}/issues/${issueIid}`,
        method: "PUT",
        data,
    });
};

export { editIssueService };
