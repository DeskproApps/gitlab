import type { Maybe, DateTime } from "../../types";

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

export type Milestone = {
    id: number,
    iid: number,
    title: string,
    web_url: string,
    description: string,
    created_at: DateTime,
    updated_at: DateTime,
    expired: boolean,
    project_id: Project["id"],
    due_date: string,   // "2022-12-31"
    start_date: string, // "2022-12-01"
    state: string,      // "active"
};

export type Label = {
    id: number,
    name: string,
    description: string,
    description_html: string,
    color: string,      // "#ff0000"
    text_color: string, // "#FFFFFF"
};

export type IssueType = "issue"|"incident"|"test_case";

export type Issue = {
    id: number,
    iid: number,
    title: string,
    description: string,
    labels: Label[],
    created_at: DateTime,
    updated_at: DateTime,
    web_url: string,
    assignee: Maybe<Member>,
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
    issue_type: IssueType,
    merge_requests_count: number,
    milestone: Maybe<Milestone>,
    moved_to_id: null,
    project_id: number,
    references: {
        short: string,      // "#1",
        relative: string,   // "#1",
        full: string,       // "zpawn/deskpro-public#1",
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

export type Project = {
    id: number,
    name: string,
    web_url: string,
    _links: {
        cluster_agents: string, // "https://gitlab.com/api/v4/projects/41163642/cluster_agents",
        events: string,         // "https://gitlab.com/api/v4/projects/41163642/events",
        issues: string,         // "https://gitlab.com/api/v4/projects/41163642/issues",
        labels: string,         // "https://gitlab.com/api/v4/projects/41163642/labels",
        members: string,        // "https://gitlab.com/api/v4/projects/41163642/members",
        merge_requests: string, // "https://gitlab.com/api/v4/projects/41163642/merge_requests",
        repo_branches: string,  // "https://gitlab.com/api/v4/projects/41163642/repository/branches",
        self: string,           // "https://gitlab.com/api/v4/projects/41163642",
    },
};

export type IssueComment = {
    id: number,
    body: string,
    system: boolean,
    attachment: null,
    author: Member,
    confidential: boolean,
    created_at: DateTime,
    updated_at: DateTime,
    internal: boolean,
    noteable_id: Issue["id"],
    noteable_iid: Issue["iid"],
    noteable_type: "Issue"
    resolvable: boolean,
    type: null,
};

export type MRState = "merged"|"opened"|"closed";

export type MergeRequest = {
    id: number,
    iid: number,
    title: string,
    state: MRState,
    web_url: string,
    labels: [],
    description: string,
    updated_at: DateTime,
    created_at: DateTime,
};
