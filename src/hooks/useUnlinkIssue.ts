import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "lodash";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { deleteEntityIssueService } from "../services/entityAssociation";
import { useDeskproLabel, useAutomatedComment } from "../hooks";
import { getEntityId } from "../utils";
import { queryClient, QueryKey } from "../query";
import type { TicketContext } from "../types";
import type { Issue, Project } from "../services/gitlab/types";

type Args = { issueIid: Issue["id"], projectId: Project["id"] };

type UseUnlinkIssue = () => {
    isLoading: boolean,
    unlinkIssue: (args: Args) => void,
};

const useUnlinkIssue: UseUnlinkIssue = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const { createAutomatedUnlinkedComment } = useAutomatedComment();
    const { removeDeskproLabel } = useDeskproLabel();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const ticketId = get(context, ["data", "ticket", "id"]);

    const unlinkIssue = useCallback(({ issueIid, projectId }: Args) => {
        if (!issueIid || !projectId || !client || !ticketId) {
            return;
        }

        setIsLoading(true);

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
                setIsLoading(false);
                navigate("/home");
            });
    }, [client, ticketId, navigate, removeDeskproLabel, createAutomatedUnlinkedComment]);

    return { unlinkIssue, isLoading };
};

export { useUnlinkIssue };
