import { useCallback } from "react";
import { useNavigate, useSearchParams, createSearchParams } from "react-router-dom";
import { useDeskproElements } from "@deskpro/app-sdk";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { useSetTitle } from "../../hooks";
import { useLoadIssueDeps } from "./hooks";
import { ViewIssue } from "../../components/ViewIssue";
import type { FC } from "react";

const ViewIssuePage: FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const issueIid = Number(searchParams.get("issueIid") || "");
    const projectId = Number(searchParams.get("projectId") || "");

    const {
        issue,
        project,
        comments,
        isLoading,
        mergeRequests,
    } = useLoadIssueDeps(issueIid, projectId);

    const onCreateIssueComment = useCallback(() => {
        navigate({
            pathname: "/create-issue-comment",
            search: `?${createSearchParams([
                ["issueIid", `${issueIid}`],
                ["projectId", `${projectId}`],
            ])}`,
        });
    }, [navigate, projectId, issueIid]);

    useSetTitle(`${issueIid}`);

    useDeskproElements(({ deRegisterElement, registerElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("plus");
        deRegisterElement("edit");

        registerElement("home", { type: "home_button", payload: { type: "changePage", path: "/home" } });
        registerElement("edit", {
            type: "edit_button",
            payload: { type: "changePage", path: `/edit-issue?issueIid=${issueIid}&projectId=${projectId}` },
        });
        registerElement("menu", {
            type: "menu",
            items: [{
                title: "Unlink issue",
                payload: {
                    type: "unlinkIssue",
                    params: { issueIid, projectId },
                },
            }],
        });
    });

     if (isLoading) {
         return (
             <LoadingSpinner/>
         );
     }

    return (
        <ViewIssue
            issue={issue}
            project={project}
            comments={comments}
            mergeRequests={mergeRequests}
            onCreateIssueComment={onCreateIssueComment}
        />
    );
};

export { ViewIssuePage };
