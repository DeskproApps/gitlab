import { FC, Fragment, useCallback } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import {
    LoadingSpinner,
    HorizontalDivider,
    useDeskproElements,
} from "@deskpro/app-sdk";
import { useLoadDependentData } from "./hooks";
import { IssueItem } from "../../components";
import { Container } from "../../components/common";
import type { Issue } from "../../services/gitlab/types";

const HomePage: FC = () => {
    const { issues, projectOptions, isLoading } = useLoadDependentData();
    const navigate = useNavigate();

    const onClickTitle = useCallback((issueIid?: Issue["iid"], projectId?: Issue["project_id"]) => {
        if (issueIid && projectId) {
            navigate({
                pathname: "/view-issue",
                search: `?${createSearchParams([
                    ["issueIid", `${issueIid}`],
                    ["projectId", `${projectId}`],
                ])}`,
            });
        }
    }, [navigate]);

    useDeskproElements(({ registerElement }) => {
        registerElement("menu", {
            type: "menu",
            items: [{
                title: "Log Out",
                payload: { type: "logout" },
            }],
        });
        registerElement("plusButton", {
            type: "plus_button",
            payload: { type: "changePage", path: "/link" },
        });
    });

    if (isLoading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <Container>
            {issues.map((issue) => (
                <Fragment key={issue.id}>
                    <IssueItem
                        issue={issue}
                        projects={projectOptions}
                        onClickTitle={() => onClickTitle(issue.iid, issue.project_id)}
                    />
                    <HorizontalDivider style={{ margin: "10px 0" }} />
                </Fragment>
            ))}
        </Container>
    )
};

export { HomePage };
