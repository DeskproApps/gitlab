import { IDeskproClient } from "@deskpro/app-sdk";
import { ENTITY_GITLAB_ISSUE } from "./constants";

const getEntityCardListService = (
    client: IDeskproClient,
    ticketId: string,
): Promise<string[]> => {
    return client
        .getEntityAssociation(ENTITY_GITLAB_ISSUE, ticketId)
        .list();
};

export { getEntityCardListService };
