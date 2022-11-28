import { ENTITY_GITLAB_ISSUE } from "./constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { TicketData } from "../../types";
import type { Issue } from "../gitlab/types";

const setEntityIssueService = (
    client: IDeskproClient,
    ticketId: TicketData["ticket"]["id"],
    issueId: Issue["id"],
) => {
    return client
        .getEntityAssociation(ENTITY_GITLAB_ISSUE, ticketId)
        .set(`${issueId}`);
};

export { setEntityIssueService };
