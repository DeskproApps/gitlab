import type { Issue } from "../services/gitlab/types";

const getEntityId = (issue: Issue): string => {
    return `${issue.project_id}:${issue.iid}`;
};

export { getEntityId };
