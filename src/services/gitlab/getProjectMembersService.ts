import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Project, Member } from "./types";

const getProjectMembersService = (
    client: IDeskproClient,
    projectId: Project["id"],
) => {
    return baseRequest<Member[]>(client, {
        url: `/projects/${projectId}/members/all`,
    });
};

export { getProjectMembersService };
