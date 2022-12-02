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
import { getOption, getEntityId } from "../../utils";
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
    const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
    const [selectedProject, setSelectedProject] = useState<Option<string|Issue["project_id"]>>(getOption("any", "Any"));

    const { isLoading, isFetching, issues, projectOptions } = useSearch(search);

    const ticketId = get(context, ["data", "ticket", "id"]);

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("plusButton");
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

    const onChangeSelectedIssue = (issue: Issue) => {
        let newSelectedIssues = [...selectedIssues];
        if (selectedIssues.includes(getEntityId(issue))) {
            newSelectedIssues = selectedIssues.filter((selectedIssueId) => selectedIssueId !== getEntityId(issue));
        } else {
            newSelectedIssues.push(getEntityId(issue));
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

        Promise
            .all(selectedIssues.map((entity) =>
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
