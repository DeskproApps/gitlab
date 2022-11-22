import { IDeskproClient } from "@deskpro/app-sdk";
import { baseGraphQLRequest } from "./baseGraphQLRequest";
import type { Maybe } from "../../types";
import type { User } from "./types";

const getCurrentUserService = (
    client: IDeskproClient
) => {
    const query = `
        query {
            currentUser {
                id, name, username
            }
        }
    `;

    return baseGraphQLRequest<Maybe<User>>(client, { query });
};

export { getCurrentUserService };
