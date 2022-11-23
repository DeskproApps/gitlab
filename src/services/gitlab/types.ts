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
