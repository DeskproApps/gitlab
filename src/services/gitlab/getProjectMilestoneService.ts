import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Project, Milestone } from "./types";

const getProjectMilestoneService = (
    client: IDeskproClient,
    projectId: Project["id"],
) => {
    return baseRequest<Milestone[]>(client, {
        url: `/projects/${projectId}/milestones`,
        queryParams: {
            state: "active",
        },
    });
};

export { getProjectMilestoneService };
