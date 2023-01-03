import { createElement } from "react";
import { useQueryWithClient } from "../../hooks";
import {
    getProjectsService,
    getProjectLabelsService,
    getProjectMembersService,
    getProjectMilestonesService,
} from "../../services/gitlab";
import { QueryKey } from "../../query";
import { getOption } from "../../utils";
import { Member } from "../common";
import type { Maybe } from "../../types";
import type { Project, Milestone, Member as MemberType, Label } from "../../services/gitlab/types";
import type { Option } from "../../types";

export type UseLoadIssueFormDeps = (params: {
    projectId: Maybe<Project["id"]>,
}) => {
    isLoading: boolean,
    projectOptions: Array<Option<Project["id"]>>
    milestoneOptions: Array<Option<Milestone["id"]>>,
    memberOptions: Array<Option<MemberType["id"]>>,
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

    const members = useQueryWithClient<MemberType[], unknown, Array<Option<MemberType["id"]>>>(
        [QueryKey.PROJECTS, projectId, QueryKey.MEMBERS],
        (client) => getProjectMembersService(client, projectId as Project["id"]),
        {
            enabled: Boolean(projectId),
            select: (data: MemberType[]) => (data || []).map(({ id, name, avatar_url }) => ({
                value: id,
                key: `${id}`,
                type: "value",
                description: name,
                label: createElement(Member, { name, avatarUrl: avatar_url }),
            })),
        },
    );

    const labels = useQueryWithClient(
        [QueryKey.PROJECTS, projectId, QueryKey.LABELS],
        (client) => getProjectLabelsService(client, projectId as Project["id"]),
        { enabled: Boolean(projectId) },
    );

    return {
        isLoading: [
            projects,
            milestones,
            members,
            labels,
        ].every(({ isLoading }) => isLoading),
        projectOptions: projects.data || [],
        milestoneOptions: milestones.data || [],
        memberOptions: members.data || [],
        labels: labels.data || [],
    };
};

export { useLoadIssueFormDeps };
