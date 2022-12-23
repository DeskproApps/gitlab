import type { TicketData } from "../types";

const getAutomatedLinkedComment = (
    ticketId: TicketData["ticket"]["id"],
    permalinkUrl: TicketData["ticket"]["permalinkUrl"],
): string => {
    return `Linked to Deskpro ticket ${ticketId}${permalinkUrl ? `, ${permalinkUrl}` : ""}`
};

const getAutomatedUnlinkedComment = (
    ticketId: TicketData["ticket"]["id"],
    permalinkUrl: TicketData["ticket"]["permalinkUrl"],
): string => {
    return `Unlinked from Deskpro ticket ${ticketId}${permalinkUrl ? `, ${permalinkUrl}` : ""}`
}

export { getAutomatedLinkedComment, getAutomatedUnlinkedComment };
