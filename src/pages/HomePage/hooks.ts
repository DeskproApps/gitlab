import { useState } from "react";
import get from "lodash/get";
import {
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { QueryKey } from "../../query";
import { getEntityIssueListService } from "../../services/entityAssociation";
import { getIssueService } from "../../services/gitlab";
import { useQueriesWithClient } from "../../hooks";
import type { Issue } from "../../services/gitlab/types";
import type { TicketContext } from "../../types";

type UseLoadDependentData = () => {
    issues: Issue[],
};

const useLoadDependentData: UseLoadDependentData = () => {
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const ticketId = get(context, ["data", "ticket", "id"]);

    const [issueIds, setIssueIds] = useState<string[]>([]);

    useInitialisedDeskproAppClient((client) => {
        getEntityIssueListService(client, ticketId)
            .then((entities) => {
                if (Array.isArray(entities) && entities.length > 0) {
                    setIssueIds(entities);
                }
            })
            .catch(() => {});
    });

    const issues = useQueriesWithClient(issueIds.map((issueId) => ({
        queryKey: [QueryKey.ISSUES, issueId],
        queryFn: (client) => getIssueService(client, issueId),
        enabled: Boolean(issueId),
    })));

    console.log(">>> home:", issues);

    return {
        issues: [],
    };
};

export { useLoadDependentData };
