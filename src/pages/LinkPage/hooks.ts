import { useState, useEffect } from "react";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";
import { useQueriesWithClient, useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { searchIssuesService, getProjectService } from "../../services/gitlab";
import { debouncePromise, getOption } from "../../utils";
import type { Option } from "../../types";
import type { Issue, Project } from "../../services/gitlab/types";

type UseSearch = (q: string) => {
    isLoading: boolean,
    isFetching: boolean,
    issues: Issue[],
    projectOptions: Array<Option<Project["id"]>>,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const useSearch: UseSearch = (q) => {
    const [projectIds, setProjectIds] = useState<number[]>([]);

    const debounceSearch = debouncePromise(searchIssuesService, 1000);

    const issues = useQueryWithClient(
        [QueryKey.SEARCH_ISSUES, q],
        (client) => debounceSearch(client, q),
        {
            retry: 0,
            cacheTime: 0,
            staleTime: 0,
            enabled: Boolean(q),
        },
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const projects = useQueriesWithClient(projectIds.map((projectId) => ({
        queryKey: [QueryKey.PROJECTS, projectId],
        queryFn: (client) => getProjectService(client, projectId),
        enabled: Boolean(projectId),
        select: (data: Project) => getOption<Project["id"]>(data.id, data.name),
    })));

    useEffect(() => {
        if (!Array.isArray(issues.data) || isEmpty(issues.data)) {
            setProjectIds([]);
            return;
        } else {
            setProjectIds(uniq(issues.data.map(({ project_id }) => project_id)));
        }

    }, [issues.data]);

    return {
        isLoading: [
            ...projects
        ].every(({ isLoading }) => isLoading),
        isFetching: issues.isFetching,
        issues: issues.data || [],
        projectOptions: projects?.map(({ data }) => data) || [],
    };
}

export { useSearch };
