import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { deleteEntityIssueService } from "../services/entityAssociation";
import { createIssueCommentService } from "../services/gitlab";
import { getEntityId, getAutomatedUnlinkedComment } from "../utils";
import { queryClient, QueryKey } from "../query";
import type { TicketContext } from "../types";
import type { Issue, Project } from "../services/gitlab/types";

type UnlinkArgs = { issueIid: Issue["id"], projectId: Project["id"] };

const useUnlinkIssue = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const ticketId = get(context, ["data", "ticket", "id"]);
    const permalink = get(context, ["data", "ticket", "permalinkUrl"]);
    const dontAddComment = get(context, ["settings", "dont_add_comment_when_linking_issue"]) === true;

    const unlinkIssue = useCallback(({ issueIid, projectId }: UnlinkArgs): void => {
        if (!issueIid || !projectId || !client || !ticketId) {
            return;
        }

        deleteEntityIssueService(client, ticketId, getEntityId({ project_id: projectId, iid: issueIid }))
            .then(() => {
                return Promise.all([
                    dontAddComment
                        ? Promise.resolve()
                        : createIssueCommentService(client, projectId, issueIid, {
                            body: getAutomatedUnlinkedComment(ticketId, permalink),
                        }),
                    queryClient.refetchQueries([QueryKey.ISSUES, projectId, issueIid]),
                    queryClient.refetchQueries([QueryKey.PROJECTS, projectId]),
                ])
            })
            .then(() => {
                navigate("/home")
            });
    }, [client, ticketId, permalink, dontAddComment, navigate]);

    return {
        unlinkIssue,
    };
};

export { useUnlinkIssue };
