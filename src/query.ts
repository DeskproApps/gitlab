import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            suspense: false,
            useErrorBoundary: true,
            refetchOnWindowFocus: false,
        },
    },
});

enum QueryKey {
    SEARCH_ISSUES = "searchIssues",
    PROJECTS = "projects",
    ISSUES = "issues",
    COMMENTS = "comments",
    MERGE_REQUESTS = "mergeRequests",
    MILESTONES = "milestones",
    MEMBERS = "members",
    LABELS = "labels",
}

export { queryClient, QueryKey };
