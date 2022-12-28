import type { SubmitHandler } from "react-hook-form";
import type { Issue, Project, Member, Milestone, Label, IssueType } from "../../services/gitlab/types";
import type { Option } from "../../types";

export type FormInput = {
    title: string,
    description: string,
    type: Option<IssueType>,
    project: Option<Project["id"]>,
    milestone: Option<Milestone["id"]>,
    assignee: Member["id"],
    labels: Array<Label["name"]>,
};

export type IssueValues = {
    title: Issue["title"],
    description: Issue["description"],
    issue_type?: IssueType,
    milestone_id?: Milestone["id"],
    assignee_id?: Member["id"],
    labels?: string,
};

export type InitParams = {
    issue?: Issue,
    labels?: Label[],
    members?: Member,
    project?: Project,
};

export type Props = {
    isEditMode?: boolean,
    onSubmit: SubmitHandler<FormInput>,
    onCancel?: () => void,
    params?: InitParams,
};
