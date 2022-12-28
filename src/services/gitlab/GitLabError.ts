import isString from "lodash/isString";
import type { GitLabErrors, ErrorWithDescription, ErrorWithMessage } from "./types";

const isErrorWithMessage = (error: GitLabErrors): error is ErrorWithMessage => {
    return !!(error as ErrorWithMessage).message;
};

const isErrorWithDescription = (error: GitLabErrors): error is ErrorWithDescription => {
    return !!(error as ErrorWithDescription).error_description;
};

export type InitData = {
    status: number,
    data: ErrorWithDescription | ErrorWithMessage,
};

class GitLabError extends Error {
    /** @see https://docs.gitlab.com/ee/api/#status-codes */
    status: number;
    data: GitLabErrors;

    constructor({ status, data }: InitData) {
        let message = "";

        if (isErrorWithMessage(data) && isString(data?.message)) {
            message = data.message;
        } else if (isErrorWithDescription(data)) {
            message = data.error_description;
        }

        super(message);

        this.data = data;
        this.status = status;
    }
}

export { GitLabError };
