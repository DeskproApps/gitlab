import { getOption } from "./getOption";
import type { IssueType } from "../services/gitlab/types";
import type { Option } from "../types";

const getIssueTypes = (): Record<IssueType, Option<string>> => ({
    issue: getOption("issue", "Issue"),
    incident: getOption("incident", "Incident"),
    test_case: getOption("test_case", "Test Case"),
});

export { getIssueTypes };
