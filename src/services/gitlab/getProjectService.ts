import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue } from "./types";

const getProjectService = (
    client: IDeskproClient,
    projectId: Issue["project_id"]|string,
) => {
    return baseRequest(client, {
        url: `/projects/${projectId}`,
    });
};

export { getProjectService };
