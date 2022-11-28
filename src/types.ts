import type { ReactNode } from "react";
import type { Context, IDeskproClient } from "@deskpro/app-sdk";

export type Maybe<T> = T | undefined | null;

export type Dict<T> = Record<string, T>;

/**
 * An ISO-8601 encoded UTC date time string. Example value: `""2019-09-07T15:50:00Z"`.
 */
export type DateTime = string;

// ToDo: change to DropdownValueType from @deskpro/deskpro-ui
export type Option<Value> = {
    value: Value,
    key: Value,
    label: ReactNode,
    type: "value",
};

export type Settings = {
    app_id: string,
    gitlab_instance_url: Maybe<string>,
};

export type TicketData = {
    env: {
        envId: string,
        release: string,
        releaseBuildTime: number,
    },
    app: {
        id: string,
        instanceId: string,
        description: string,
        name: "@deskpro-apps/gitlab"
        title: "GitLab",
    },
    ticket: {
        id: string,
        subject: string,
        permalinkUrl: string,
        primaryUser: {
            customFields: object,
            displayName: string,
            email: string,
            emails: string[],
            firstName: string,
            id: string,
            language: string,
            lastName: string,
            locale: string,
        },
    },
    currentAgent: {
        avatarUrl: string,
        emails: string[],
        firstName: string,
        id: string,
        isAdmin: boolean,
        isAgent: boolean,
        isChatOnline: boolean,
        isOnline: boolean,
        language: string,
        lastName: string,
        locale: string,
        name: string,
        primaryEmail: string,
        teams: Array<{ id: string, name: string }>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userGroups: any[],
    },
};

export type TicketContext = Context<TicketData, Maybe<Settings>>;

export type ApiRequestMethod = "GET" | "POST";

/*export type RequestParams = {
    query: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables?: Record<string, any>
};*/

export type RequestParams = {
    url: string,
    method?: ApiRequestMethod,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    headers?: Dict<string>,
    queryParams?: Dict<string>,
};

export type Request = <T>(
    client: IDeskproClient,
    params: RequestParams,
) => Promise<T>;

export type EventPayload =
    | { type: "changePage", path: string }
    | { type: "logout" }
;
