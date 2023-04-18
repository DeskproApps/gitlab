import { useCallback } from "react";
import get from "lodash.get";
import {
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { createIssueCommentService } from "../services/gitlab";
import {
    getAutomatedLinkedComment,
    getAutomatedUnlinkedComment,
} from "../utils";
import type { TicketContext } from "../types";
import type { Project, Issue, IssueComment } from "../services/gitlab/types";

type UseAutomatedComment = () => {
    createAutomatedLinkedComment: (
        projectId: Project["id"],
        issueIid: Issue["iid"],
    ) => Promise<IssueComment|void>,
    createAutomatedUnlinkedComment: (
        projectId: Project["id"],
        issueIid: Issue["iid"],
    ) => Promise<IssueComment|void>,
};

const useAutomatedComment: UseAutomatedComment = () => {
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const ticketId = get(context, ["data", "ticket", "id"]);
    const permalink = get(context, ["data", "ticket", "permalinkUrl"]);
    const dontAddComment = get(context, ["settings", "dont_add_comment_when_linking_issue"]) === true;

    const createAutomatedLinkedComment = useCallback((
        projectId: Project["id"],
        issueIid: Issue["iid"],
    ) => {
        if (!client || dontAddComment || !ticketId) {
            return Promise.resolve();
        }

        return createIssueCommentService(client, projectId, issueIid, {
            body: getAutomatedLinkedComment(ticketId, permalink)
        });
    }, [client, dontAddComment, ticketId, permalink]);

    const createAutomatedUnlinkedComment = useCallback((
        projectId: Project["id"],
        issueIid: Issue["iid"],
    ) => {
        if (!client || dontAddComment || !ticketId) {
            return Promise.resolve();
        }

        return createIssueCommentService(client, projectId, issueIid, {
            body: getAutomatedUnlinkedComment(ticketId, permalink),
        });
    }, [client, dontAddComment, ticketId, permalink]);

    return {
        createAutomatedLinkedComment,
        createAutomatedUnlinkedComment,
    };
};

export { useAutomatedComment };
