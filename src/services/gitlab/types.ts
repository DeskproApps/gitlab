export type OAuthToken = {
    token_type: "Bearer",
    scope: string,
    access_token: number,
    refresh_token: string,
    created_at: number,
    expires_in: number,
};

export type User = {
    currentUser: {
        id: string,
        name: string,
        username: string,
    },
};
