import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue } from "./types";

const searchIssuesService = (
    client: IDeskproClient,
    q: string,
) => {
    return baseRequest<Issue[]>(client, {
        url: "/issues",
        queryParams: {
            search: q,
            with_labels_details: "true",
        }
    });
};

export { searchIssuesService }
