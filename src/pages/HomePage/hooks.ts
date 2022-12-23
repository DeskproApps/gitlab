import { useState } from "react";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import {
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { QueryKey } from "../../query";
import { getEntityIssueListService } from "../../services/entityAssociation";
import {
    getIssueService,
    getProjectService,
} from "../../services/gitlab";
import { useQueriesWithClient } from "../../hooks";
import { getOption } from "../../utils";
import type { Issue, Project } from "../../services/gitlab/types";
import type { TicketContext, Option } from "../../types";

type UseLoadDependentData = () => {
    isLoading: boolean,
    issues: Issue[],
    projectOptions: Array<Option<Project["id"]>>,
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore need to fix hook typings
    const issues = useQueriesWithClient<Issue>(entityIds.map((entity) => {
        const [projectId, issueIid] = entity.split(":");

        return {
            queryKey: [QueryKey.ISSUES, projectId, issueIid],
            queryFn: (client) => getIssueService(client, projectId, issueIid),
            enabled: Boolean(projectId) && Boolean(issueIid),
            select: (data) => get(data, [0]),
            useErrorBoundary: false,
        }
    }));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const projects = useQueriesWithClient(entityIds.map((entity) => {
        const [projectId] = entity.split(":");

        return {
            queryKey: [QueryKey.PROJECTS, projectId],
            queryFn: (client) => getProjectService(client, projectId),
            enabled: Boolean(projectId) && issues.every(({ isFetched }) => isFetched),
            select: (data: Project) => getOption<Project["id"]>(data.id, data.name),
            useErrorBoundary: false,
        }
    }));

    return {
        isLoading: isEmpty(entityIds) ? false : [
            ...issues,
            ...projects,
        ].every(({ isLoading }) => isLoading),
        issues: issues?.filter(({ data }) => Boolean(data)).map(({ data }) => data) || [] as Issue[],
        projectOptions: projects?.filter(({ data }) => Boolean(data)).map(({ data }) => data) || [] as Array<Option<Project["id"]>>,
    };
};

export { useLoadDependentData };
