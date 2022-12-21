import type { SubmitHandler } from "react-hook-form";

export type FormInput = {
    comment: string,
};

export type IssueCommentValues = {
    body: string,
};

export type Props = {
    onSubmit: SubmitHandler<FormInput>,
    onCancel?: () => void,
};
