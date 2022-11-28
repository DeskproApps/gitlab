import { ENTITY_GITLAB_ISSUE } from "./constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { TicketData } from "../../types";

const setEntityIssueService = (
    client: IDeskproClient,
    ticketId: TicketData["ticket"]["id"],
    entity: string,
) => {
    return client
        .getEntityAssociation(ENTITY_GITLAB_ISSUE, ticketId)
        .set(entity);
};

export { setEntityIssueService };
