import { useQueryWithClient } from "../../hooks";
import {
    getProjectsService,
    getProjectLabelsService,
    getProjectMembersService,
    getProjectMilestonesService,
} from "../../services/gitlab";
import { QueryKey } from "../../query";
import { getOption } from "../../utils";
import type { Maybe } from "../../types";
import type { Project, Milestone, Member, Label } from "../../services/gitlab/types";
import type { Option } from "../../types";

export type UseLoadIssueFormDeps = (params: {
    projectId: Maybe<Project["id"]>,
}) => {
    projectOptions: Array<Option<Project["id"]>>
    milestoneOptions: Array<Option<Milestone["id"]>>,
    memberOptions: Array<Option<Member["id"]>>,
    labels: Label[],
};

const useLoadIssueFormDeps: UseLoadIssueFormDeps = ({ projectId }) => {
    const projects = useQueryWithClient<Project[], unknown, Array<Option<Project["id"]>>>(
        [QueryKey.PROJECTS],
        getProjectsService,
        {
            select: (data: Project[]) => (data || []).map(({ id, name }) => getOption(id, name)),
        },
    );

    const milestones = useQueryWithClient<Milestone[], unknown, Array<Option<Milestone["id"]>>>(
        [QueryKey.PROJECTS, projectId, QueryKey.MILESTONES],
        (client) => getProjectMilestonesService(client, projectId as Project["id"]),
        {
            enabled: Boolean(projectId),
            select: (data: Milestone[]) => (data || []).map(({ id, title }) => getOption(id, title)),
        },
    );

    const members = useQueryWithClient<Member[], unknown, Array<Option<Member["id"]>>>(
        [QueryKey.PROJECTS, projectId, QueryKey.MEMBERS],
        (client) => getProjectMembersService(client, projectId as Project["id"]),
        {
            enabled: Boolean(projectId),
            select: (data: Member[]) => (data || []).map(({ id, name }) => getOption(id, name)),
        },
    );

    const labels = useQueryWithClient(
        [QueryKey.PROJECTS, projectId, QueryKey.LABELS],
        (client) => getProjectLabelsService(client, projectId as Project["id"]),
        { enabled: Boolean(projectId) },
    );

    return {
        projectOptions: projects.data || [],
        milestoneOptions: milestones.data || [],
        memberOptions: members.data || [],
        labels: labels.data || [],
    };
};

export { useLoadIssueFormDeps };
