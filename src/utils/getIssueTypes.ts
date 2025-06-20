import { getOption } from "./getOption";
import type { IssueType } from "../services/gitlab/types";
import type { Option } from "../types";

const getIssueTypes = (): Record<IssueType, Option<IssueType>> => ({
    issue: getOption<IssueType>("issue", "Issue"),
    incident: getOption<IssueType>("incident", "Incident"),
    test_case: getOption<IssueType>("test_case", "Test Case"),
});

export { getIssueTypes };
