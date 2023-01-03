import { ENTITY_GITLAB_ISSUE } from "./constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { TicketData, EntityMetadata } from "../../types";

const setEntityIssueService = (
    client: IDeskproClient,
    ticketId: TicketData["ticket"]["id"],
    entity: string,
    metaData?: EntityMetadata,
) => {
    return client
        .getEntityAssociation(ENTITY_GITLAB_ISSUE, ticketId)
        .set(entity, metaData);
};

export { setEntityIssueService };
