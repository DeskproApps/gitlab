import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Project } from "./types";

const getProjectService = (
    client: IDeskproClient,
    projectId: Project["id"]|string,
) => {
    return baseRequest<Project>(client, {
        url: `/projects/${projectId}`,
    });
};

export { getProjectService };
