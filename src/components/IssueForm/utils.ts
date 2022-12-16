import * as yup from "yup";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { getOption, getIssueTypes } from "../../utils";
import type { Label } from "../../services/gitlab/types";
import type { FormInput, IssueValues, InitParams } from "./types";

const validationSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string(),
    type: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string().oneOf(["issue", "incident", "test_case"]),
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

const getInitValues = (params: InitParams = {}): FormInput => {
    const issueTypes = getIssueTypes();
    const projectId = get(params, ["project", "id"]);
    const projectName = get(params, ["project", "name"]);
    const milestoneId = get(params, ["issue", "milestone", "id"]);
    const milestoneTitle = get(params, ["issue","milestone", "title"]);
    const labels = (get(params, ["issue", "labels"]) || []).map(({ name }: Label) => name);
    const assigneeId = get(params, ["issue", "assignee", "id"]);
    const assigneeName = get(params, ["issue", "assignee", "name"]);

    return {
        title: get(params, ["issue", "title"], ""),
        description: get(params, ["issue", "description"], ""),
        type: get(issueTypes, [get(params, ["issue", "issue_type"])], getOption("issue", "Issue")),
        project: (projectId && projectName) ? getOption(projectId, projectName) : getOption(0, ""),
        milestone: (milestoneId && milestoneTitle) ? getOption(milestoneId, milestoneTitle) : getOption(0, ""),
        assignees: (assigneeId && assigneeName) ? getOption(assigneeId, assigneeName) : getOption(0, ""),
        labels: Array.isArray(labels) ? labels : [],
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
