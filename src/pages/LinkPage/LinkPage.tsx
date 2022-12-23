import { FC, ChangeEvent, useState, useCallback } from "react";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import {
    TwoButtonGroup,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { LinkIssue } from "../../components";
import { Container } from "../../components/common";
import { useSetTitle, useDeskproLabel } from "../../hooks";
import { useSearch } from "./hooks";
import { setEntityIssueService } from "../../services/entityAssociation";
import { createIssueCommentService } from "../../services/gitlab";
import { getOption, getEntityId, getAutomatedLinkedComment } from "../../utils";
import type { Option, TicketContext } from "../../types";
import type { Issue } from "../../services/gitlab/types";

const getFilteredIssues = (issues: Issue[], selectedProject: Option<Issue["project_id"]|"any">) => {
    if (selectedProject?.value === "any") {
        return issues
    }

    return issues.filter(({ project_id }) => project_id === selectedProject?.value);
};

const LinkPage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const { addDeskproLabel } = useDeskproLabel();

    const [search, setSearch] = useState<string>("");
    const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
    const [selectedProject, setSelectedProject] = useState<Option<Issue["project_id"]|"any">>(getOption("any", "Any"));

    const { isLoading, isFetching, issues, projectOptions } = useSearch(search);

    const ticketId = get(context, ["data", "ticket", "id"]);
    const permalink = get(context, ["data", "ticket", "permalinkUrl"]);
    const dontAddComment = get(context, ["settings", "dont_add_comment_when_linking_issue"]) === true;

    const onNavigateToCreateIssue = useCallback(() => navigate("/create-issue"), [navigate]);

    useSetTitle("Add Issues");

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("plus");
        deRegisterElement("edit");

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

    const onChangeSelect = (option: Option<Issue["project_id"]|"any">) => {
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

    const onLinkIssues = useCallback(() => {
        if (!client || !ticketId || selectedIssues.length === 0) {
            return;
        }

        Promise
            .all([
                ...selectedIssues.map((entity) => setEntityIssueService(client, ticketId, entity)),
                ...selectedIssues.map((entity) => {
                    const [projectId, issueIid] = entity.split(":");
                    return addDeskproLabel(projectId, issueIid);
                }),
                ...(dontAddComment
                    ? [Promise.resolve()]
                    : selectedIssues.map((entity) => {
                        const [projectId, issueIid] = entity.split(":");
                        return createIssueCommentService(client, projectId, issueIid, {
                            body: getAutomatedLinkedComment(ticketId, permalink),
                        })
                    })
                ),
                ...selectedIssues.map((entity) => {
                    const [projectId, issueIid] = entity.split(":");
                    return addDeskproLabel(projectId, issueIid);
                })
            ])
            .then(() => navigate("/home"))
    }, [navigate, client, ticketId, permalink, selectedIssues, dontAddComment, addDeskproLabel]);

    return (
        <Container>
            <TwoButtonGroup
                selected="one"
                oneLabel="Find Issue"
                oneIcon={faSearch}
                twoLabel="Create Issue"
                twoIcon={faPlus}
                oneOnClick={() => {}}
                twoOnClick={onNavigateToCreateIssue}
            />
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
        </Container>
    );
};

export { LinkPage };
