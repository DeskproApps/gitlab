import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Project, Label } from "./types";

const createProjectLabelService = (
    client: IDeskproClient,
    projectId: Project["id"],
    data: {
        name: string,
        color: string,
        description?: string,
        priority?: number,
    },
) => {
    return baseRequest<Label>(client, {
        url: `/projects/${projectId}/labels`,
        method: "POST",
        data,
    });
};

export { createProjectLabelService };
