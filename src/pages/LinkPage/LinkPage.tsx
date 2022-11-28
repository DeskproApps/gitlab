import { FC, ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import {
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { LinkIssue } from "../../components";
import { useSearch } from "./hooks";
import { setEntityIssueService } from "../../services/entityAssociation";
import { getOption, normalize } from "../../utils";
import type { Option } from "../../types";
import type { Issue } from "../../services/gitlab/types";

const getFilteredIssues = (issues: Issue[], selectedProject: Option<string|Issue["project_id"]>) => {
    if (selectedProject.value === "any") {
        return issues
    }

    return issues.filter(({ project_id }) => project_id === selectedProject.value);
};

const LinkPage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();

    const [search, setSearch] = useState<string>("");
    const [selectedIssues, setSelectedIssues] = useState<Array<Issue["id"]>>([]);
    const [selectedProject, setSelectedProject] = useState<Option<string|Issue["project_id"]>>(getOption("any", "Any"));

    const { isLoading, isFetching, issues, projectOptions } = useSearch(search);

    const ticketId = get(context, ["data", "ticket", "id"]);

    useDeskproElements(({ registerElement }) => {
        registerElement("menu", {
            type: "menu",
            items: [{
                title: "Log Out",
                payload: { type: "logout" },
            }],
        });
    });

    const onChangeSearch = ({ target: { value: q }}: ChangeEvent<HTMLInputElement>) => {
        if (!client) {
            return;
        }

        setSearch(q);
    };

    const onClearSearch = () => {
        setSearch("");
    };

    const onChangeSelect = (option: Option<string|Issue["project_id"]>) => {
        setSelectedProject(option);
    };

    const onChangeSelectedIssue = (issueId: Issue["id"]) => {
        let newSelectedIssues = [...selectedIssues];
        if (selectedIssues.includes(issueId)) {
            newSelectedIssues = selectedIssues.filter((selectedIssueId) => selectedIssueId !== issueId);
        } else {
            newSelectedIssues.push(issueId);
        }
        setSelectedIssues(newSelectedIssues);
    };

    const onCancel = () => {
        navigate("/home");
    };

    const onLinkIssues = () => {
        if (!client || !ticketId || selectedIssues.length === 0) {
            return;
        }

        const issuesMap = normalize(issues);
        const selectedEntities: string[] = selectedIssues
            .map((issueId) => {
                const issue = get(issuesMap, [issueId], null);
                if (issue) {
                    return `${issue.project_id}:${issue.iid}`;
                }
            })
            .filter((entity) => Boolean(entity)) as string[];

        Promise
            .all(selectedEntities.map((entity) =>
                setEntityIssueService(client, ticketId, entity)
            ))
            .then(() => navigate("/home"))
    };

    return (
        <LinkIssue
            onChange={onChangeSearch}
            onClear={onClearSearch}
            isFetching={isFetching}
            isLoading={isLoading}
            value={search}
            selectedProject={selectedProject}
            onChangeSelect={onChangeSelect}
            onChangeSelectedIssue={onChangeSelectedIssue}
            selectedIssues={selectedIssues}
            projectOptions={[getOption("any", "Any"), ...projectOptions.filter((o) => Boolean(o))]}
            issues={getFilteredIssues(issues, selectedProject)}
            onLinkIssues={onLinkIssues}
            onCancel={onCancel}
        />
    );
};

export { LinkPage };
