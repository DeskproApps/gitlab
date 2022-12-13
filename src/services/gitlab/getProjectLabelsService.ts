import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Project, Label } from "./types";

const getProjectLabelsService = (
    client: IDeskproClient,
    projectId: Project["id"],
) => {
    return baseRequest<Label[]>(client, {
        url: `/projects/${projectId}/labels`,
    });
};

export { getProjectLabelsService };
