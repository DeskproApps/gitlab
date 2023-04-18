import get from "lodash.get";
import pick from "lodash.pick";
import isEmpty from "lodash.isempty";
import type { Issue, Project } from "../services/gitlab/types";
import type { Option, EntityMetadata } from "../types";

const getEntityMetadata = (
    issue?: Issue,
    projectOptions?: Array<Option<Project["id"]>>,
): undefined|EntityMetadata => {
    if (!issue || isEmpty(issue)) {
        return;
    }

    const labels = (get(issue, ["labels"], []) || [])
        .map((label) => pick(label, ["id", "name"]));

    const assignees = (get(issue, ["assignees"], []) || [])
        .map((member) => pick(member, ["username", "name"]));

    const project = (projectOptions || []).find(({ value }) => Number(value) === Number(issue.project_id));

    return {
        id: get(issue, ["id"], ""),
        iid: issue.iid,
        title: issue.title,
        project: get(project, ["label"], "") as string,
        milestone: get(issue, ["milestone", "title"]),
        assignees: assignees,
        labels: labels,
        createdAt: get(issue, ["created_at"], ""),
        updatedAt: get(issue, ["updated_at"], ""),
    };
};

export { getEntityMetadata };
