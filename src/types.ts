import type { Context, IDeskproClient } from "@deskpro/app-sdk";

export type Maybe<T> = T | undefined | null;

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

export type RequestParams = {
    query: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables?: Record<string, any>
};

export type Request = <T>(
    client: IDeskproClient,
    params: RequestParams,
) => Promise<T>;

export type EventPayload =
    | { type: "changePage", path: string }
    | { type: "logout" }
;
