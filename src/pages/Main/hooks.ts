import { useState, useEffect } from "react";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import { useNavigate } from "react-router-dom";
import {
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import {
    getIssueService,
    getCurrentUserService,
} from "../../services/gitlab";
import { getEntityIssueListService } from "../../services/entityAssociation";
import { useQueriesWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import type { TicketContext, Maybe } from "../../types";
import type { Issue } from "../../services/gitlab/types";

const useCheckLinkedIssues = () => {
    const [entityIds, setEntityIds] = useState<Maybe<string[]>>(null);
    const navigate = useNavigate();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const ticketId = get(context, ["data", "ticket", "id"]);

    useInitialisedDeskproAppClient(async (client) => {
        if (!ticketId) {
            return;
        }

        const isAuth = await getCurrentUserService(client)
            .then((user) => Boolean(get(user, ["id"], null)))
            .catch(() => false)

        if (!isAuth) {
            navigate("/login");
            return;
        }

        try {
            const entities = await getEntityIssueListService(client, ticketId);

            if (Array.isArray(entities) && entities.length > 0) {
                setEntityIds(entities);
            } else {
                setEntityIds([]);
            }
        } catch (e) {
            navigate("/link");
        }
    }, [ticketId]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Need to fix hook typings
    const issues = useQueriesWithClient<Issue[]>((entityIds || []).map((entity) => {
        const [projectId, issueIid] = entity.split(":");

        return {
            queryKey: [QueryKey.ISSUES, projectId, issueIid],
            queryFn: (client) => getIssueService(client, projectId, issueIid),
            enabled: Boolean(projectId) && Boolean(issueIid) && (entityIds !== null),
            select: (data) => get(data, [0]),
            useErrorBoundary: false,
        }
    }));

    /** Checking if have access to all issues */
    useEffect(() => {
        const isReady = issues.every(({ isLoading, isFetched }) => !isLoading && isFetched);

        if (entityIds === null || !isReady) {
            return;
        }

        const filteredIssues = issues?.filter(({ data }) => Boolean(data)).map(({ data }) => data) || [];

        if (isEmpty(filteredIssues)) {
            navigate("/link");
        } else {
            navigate("/home");
        }
    }, [navigate, entityIds, issues]);
};

export { useCheckLinkedIssues };
