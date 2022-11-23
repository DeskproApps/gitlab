import type { Context, IDeskproClient } from "@deskpro/app-sdk";

export type Maybe<T> = T | undefined | null;

export type Dict<T> = Record<string, T>;

/**
 * An ISO-8601 encoded UTC date time string. Example value: `""2019-09-07T15:50:00Z"`.
 */
export type DateTime = string;

export type Settings = {
    app_id: string,
    gitlab_instance_url: Maybe<string>,
};

export type TicketData = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    env: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ticket: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentAgent: any,
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
