import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            suspense: true,
            useErrorBoundary: true,
            refetchOnWindowFocus: false,
        },
    },
});

enum QueryKey {
    //..
}

export { queryClient, QueryKey };
