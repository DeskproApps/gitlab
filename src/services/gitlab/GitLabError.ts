export type InitData = {
    message: string,
};

class GitLabError extends Error {
    constructor({ message }: InitData) {
        super(message);
    }
}

export { GitLabError };
