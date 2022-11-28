import { useState } from "react";
import get from "lodash/get";
import {
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { QueryKey } from "../../query";
import { getEntityIssueListService } from "../../services/entityAssociation";
import { getIssueService, getProjectService } from "../../services/gitlab";
import { useQueriesWithClient } from "../../hooks";
import { getOption } from "../../utils";
import type { Issue } from "../../services/gitlab/types";
import type { TicketContext, Option } from "../../types";

type UseLoadDependentData = () => {
    isLoading: boolean,
    issues: Issue[],
    projectOptions: Array<Option<Issue["project_id"]>>,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const useLoadDependentData: UseLoadDependentData = () => {
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const ticketId = get(context, ["data", "ticket", "id"]);

    const [entityIds, setEntityIds] = useState<string[]>([]);

    useInitialisedDeskproAppClient((client) => {
        getEntityIssueListService(client, ticketId)
            .then((entities) => {
                if (Array.isArray(entities) && entities.length > 0) {
                    setEntityIds(entities);
                }
            })
            .catch(() => {});
    });

    const issues = useQueriesWithClient(entityIds.map((entity) => {
        const [projectId, issueIid] = entity.split(":");

        return {
            queryKey: [QueryKey.ISSUES, projectId, issueIid],
            queryFn: (client) => getIssueService(client, projectId, issueIid),
            enabled: Boolean(projectId) && Boolean(issueIid),
        }
    }));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const projects = useQueriesWithClient(entityIds.map((entity) => {
        const [projectId] = entity.split(":");

        return {
            queryKey: [QueryKey.PROJECTS, projectId],
            queryFn: (client) => getProjectService(client, projectId),
            enabled: Boolean(projectId),
            select: (data) => getOption<Issue["project_id"]>(data.id, data.name),
        }
    }));

    return {
        isLoading: [
            ...issues,
            ...projects,
        ].every(({ isLoading }) => isLoading),
        issues: issues?.filter(({ data }) => Boolean(data))?.map(({ data }) => data) || [],
        projectOptions: projects?.filter((p) => Boolean(p)).map(({ data }) => data) || [],
    };
};

export { useLoadDependentData };
