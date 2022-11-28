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
}

export { queryClient, QueryKey };
