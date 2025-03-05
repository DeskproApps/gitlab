import type { ParamKeyValuePair } from "react-router-dom";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { Context, IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Milestone, Project, Member, Label } from "./services/gitlab/types";

export type Maybe<T> = T | undefined | null;

export type Dict<T> = Record<string, T>;

/**
 * An ISO-8601 encoded UTC date time string. Example value: `""2019-09-07T15:50:00Z"`.
 */
export type DateTime = string;

export type Option<Value = unknown> = Omit<DropdownValueType<Value>, "subItems">;

export type Settings = {
    use_deskpro_saas: boolean,
    app_id: string,
    gitlab_instance_url: Maybe<string>,
    dont_add_comment_when_linking_issue: boolean,
    dont_add_deskpro_label: boolean,
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

export type ApiRequestMethod = "GET" | "POST" | "PUT";

export type RequestParams = {
    url?: string,
    rawUrl?: string,
    method?: ApiRequestMethod,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    headers?: Dict<string>,
    queryParams?: Dict<string>|ParamKeyValuePair[],
};

export type Request = <T>(
    client: IDeskproClient,
    params: RequestParams,
) => Promise<T>;

export type EventPayload =
    | { type: "changePage", path: string }
    | { type: "logout" }
    | { type: "unlinkIssue", params: {
        issueIid: Issue["iid"],
        projectId: Issue["project_id"],
    }}
;

export type EntityMetadata = {
    id: Issue["id"]|string,
    iid: Issue["iid"]|string,
    title: Issue["title"],
    project: Project["name"],
    milestone: Milestone["title"],
    assignees: Array<{
        username: Member["username"],
        name: Member["name"],
    }>,
    labels: Array<{
        id: Label["id"],
        name: Label["name"],
    }>,
    createdAt: DateTime,
    updatedAt: DateTime,
};
