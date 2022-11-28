import type { DateTime } from "../../types";

export type OAuthToken = {
    token_type: "Bearer",
    scope: string,
    access_token: number,
    refresh_token: string,
    created_at: number,
    expires_in: number,
};

export type User = {
    id: number,
    username: string,
    name: string,
    state: string, // "active"
    avatar_url: string,
    web_url: string,
    created_at: DateTime,
    bio: string,
    location: null,
    public_email: string,
    skype: string,
    linkedin: string,
    twitter: string,
    website_url: string,
    organization: null,
    job_title: string,
    pronouns: null,
    bot: boolean,
    work_information: null,
    followers: number,
    following: number,
    is_followed: boolean,
    local_time: string, // "8:12 PM"
    last_sign_in_at: DateTime,
    confirmed_at: DateTime,
    last_activity_on: string, // "2022-11-23"
    email: string,
    theme_id: number,
    color_scheme_id: number,
    projects_limit: number,
    current_sign_in_at: DateTime,
    identities: string[],
    can_create_group: boolean,
    can_create_project: boolean,
    two_factor_enabled: boolean,
    external: boolean,
    private_profile: boolean,
    commit_email: string,
    shared_runners_minutes_limit: null,
    extra_shared_runners_minutes_limit: null
};

export type Member = {
    id: number,
    username: string,
    name: string,
    state: string,
    web_url: string,
    avatar_url: string,
};

export type Issue = {
    id: number,
    iid: number,
    title: string,
    description: string,
    labels: string[],
    created_at: DateTime,
    updated_at: DateTime,
    web_url: string,
    assignee: Member|null,
    assignees: Member[],
    author: Member,
    blocking_issues_count: number,
    closed_at: null,
    closed_by: null,
    confidential: boolean,
    discussion_locked: null,
    downvotes: number,
    due_date: null,
    has_tasks: boolean,
    issue_type: "issue",
    merge_requests_count: number,
    milestone: null,
    moved_to_id: null,
    project_id: number,
    references: {
        short: string, // "#1",
        relative: string, // "#1",
        full: string, // "zpawn/deskpro-public#1",
    },
    service_desk_reply_to: null,
    severity: "UNKNOWN",
    state: "opened",
    task_completion_status: {
        count: number,
        completed_count: number,
    },
    time_stats: {
        human_time_estimate: null
        human_total_time_spent: null
        time_estimate: number,
        total_time_spent: number,
    },
    type: "ISSUE",
    upvotes: number,
    user_notes_count: number,
    _links: {
        award_emoji: string,
        closed_as_duplicate_of: null,
        notes: string,
        project: string,
        self: string,
    },
};
