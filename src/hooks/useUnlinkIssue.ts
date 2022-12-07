// import { getEntityId } from "../utils";
import type { Issue, Project } from "../services/gitlab/types";

type UnlinkArgs = { issueIid: Issue["id"], projectId: Project["id"] };

const useUnlinkIssue = () => {
    const unlinkIssue = ({ issueIid, projectId }: UnlinkArgs): void => {
        if (!issueIid || !projectId) {
            return;
        }
        // console.log(">>> useUnlink:", issueIid, projectId, getEntityId({ project_id: projectId, iid: issueIid }));
    };

    return {
        unlinkIssue,
    };
};

export { useUnlinkIssue };
