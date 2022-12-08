import { IDeskproClient } from "@deskpro/app-sdk";
import { ENTITY_GITLAB_ISSUE } from "./constants";

const deleteEntityIssueService = (
    client: IDeskproClient,
    ticketId: string,
    id: string,
) => {
    return client
        .getEntityAssociation(ENTITY_GITLAB_ISSUE, ticketId)
        .delete(id);
};

export { deleteEntityIssueService };
