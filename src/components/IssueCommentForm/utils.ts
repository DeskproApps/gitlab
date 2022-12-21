import * as yup from "yup";
import type { FormInput, IssueCommentValues } from "./types";

const validationSchema = yup.object().shape({
    comment: yup.string().required(),
});

const getInitValues = (): FormInput => {
    return {
        comment: "",
    }
};

const getIssueCommentValues = (data: FormInput): IssueCommentValues => {
    return {
        body: data.comment,
    };
};

export {
    getInitValues,
    validationSchema,
    getIssueCommentValues,
};
