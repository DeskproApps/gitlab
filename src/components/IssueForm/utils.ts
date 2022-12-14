import * as yup from "yup";
import isEmpty from "lodash/isEmpty";
import { getOption } from "../../utils";
import type { FormInput, IssueValues } from "./types";

const validationSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string(),
    type: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string().oneOf(["issue", "incident"]),
        type: yup.string().oneOf(["value"]),
    }),
    project: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string().required(),
        type: yup.string().oneOf(["value"]),
    }),
    milestone: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string(),
        type: yup.string().oneOf(["value"]),
    }),
    assignees: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string(),
        type: yup.string().oneOf(["value"]),
    }),
    labels: yup.array(yup.string()),
});

const getInitValues = (): FormInput => {
    return {
        title: "",
        description: "",
        type: getOption("issue", "Issue"),
        project: getOption(0, ""),
        milestone: getOption(0, ""),
        assignees: getOption(0, ""),
        labels: [],
    };
};

const getIssueValues = (data: FormInput): IssueValues => ({
    title: data.title,
    description: data.description,
    ...(isEmpty(data.type.value) ? {} : { issue_type: data.type.value }),
    ...(isEmpty(data.milestone.value) ? {} : { milestone_id: data.milestone.value }),
    ...(isEmpty(data.assignees.value) ? {} : { assignee_id: data.assignees.value }),
    ...(isEmpty(data.labels) ? {} : { labels: data.labels.join(",") }),
});

export {
    getInitValues,
    getIssueValues,
    validationSchema,
};
