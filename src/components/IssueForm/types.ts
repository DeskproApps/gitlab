import type { SubmitHandler } from "react-hook-form";
import type { Issue, Project, Member, Milestone, Label } from "../../services/gitlab/types";
import type { Option } from "../../types";

export type FormInput = {
    title: string,
    description: string,
    type: Option<"issue" | "incident">,
    project: Option<Project["id"]>,
    milestone: Option<Milestone["id"]>,
    assignees: Option<Member["id"]>,
    labels: Array<Label["name"]>,
};

export type IssueValues = {
    title: Issue["title"],
    description: Issue["description"],
    issue_type?: "issue"|"incident",
    milestone_id?: Milestone["id"],
    assignee_id?: Member["id"],
    labels?: string,
};

export type Props = {
    onSubmit: SubmitHandler<FormInput>,
    onCancel?: () => void,
};
