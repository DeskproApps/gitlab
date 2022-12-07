import type { Issue } from "../services/gitlab/types";

type GetEntityId = (issue: Pick<Issue, "iid"|"project_id">) => string;

const getEntityId: GetEntityId = ({ project_id, iid }) => {
    return `${project_id}:${iid}`;
};

export { getEntityId };
