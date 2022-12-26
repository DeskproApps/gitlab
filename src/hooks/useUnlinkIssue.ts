import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { deleteEntityIssueService } from "../services/entityAssociation";
import { useDeskproLabel, useAutomatedComment } from "../hooks";
import { getEntityId } from "../utils";
import { queryClient, QueryKey } from "../query";
import type { TicketContext } from "../types";
import type { Issue, Project } from "../services/gitlab/types";

type UnlinkArgs = { issueIid: Issue["id"], projectId: Project["id"] };

const useUnlinkIssue = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const { createAutomatedUnlinkedComment } = useAutomatedComment();
    const { removeDeskproLabel } = useDeskproLabel();
    const ticketId = get(context, ["data", "ticket", "id"]);

    const unlinkIssue = useCallback(({ issueIid, projectId }: UnlinkArgs): void => {
        if (!issueIid || !projectId || !client || !ticketId) {
            return;
        }

        deleteEntityIssueService(client, ticketId, getEntityId({ project_id: projectId, iid: issueIid }))
            .then(() => {
                return Promise.all([
                    createAutomatedUnlinkedComment(projectId, issueIid),
                    removeDeskproLabel(projectId, issueIid),
                    queryClient.refetchQueries([QueryKey.ISSUES, projectId, issueIid]),
                    queryClient.refetchQueries([QueryKey.PROJECTS, projectId]),
                ])
            })
            .then(() => {
                navigate("/home")
            });
    }, [client, ticketId, navigate, removeDeskproLabel, createAutomatedUnlinkedComment]);

    return {
        unlinkIssue,
    };
};

export { useUnlinkIssue };
