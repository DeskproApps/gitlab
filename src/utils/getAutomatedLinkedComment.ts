const getAutomatedLinkedComment = (ticketId: any, permalinkUrl: any): string => {
    return `Linked to Deskpro ticket ${ticketId}${permalinkUrl ? `, ${permalinkUrl}` : ""}`
};

const getAutomatedUnlinkedComment = (ticketId: any, permalinkUrl: any): string => {
    return `Unlinked from Deskpro ticket ${ticketId}${permalinkUrl ? `, ${permalinkUrl}` : ""}`
}

export { getAutomatedLinkedComment, getAutomatedUnlinkedComment };
