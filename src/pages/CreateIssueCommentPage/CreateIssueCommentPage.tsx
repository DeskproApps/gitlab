import { useCallback } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDeskproAppClient, useDeskproElements } from "@deskpro/app-sdk";
import { queryClient, QueryKey } from "../../query";
import { useSetTitle } from "../../hooks";
import { createIssueCommentService } from "../../services/gitlab";
import { getIssueCommentValues, IssueCommentForm } from "../../components";
import type { FC } from "react";

const CreateIssueCommentPage: FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();

    const issueIid = Number(searchParams.get("issueIid") || "");
    const projectId = Number(searchParams.get("projectId") || "");

    const onCancel = useCallback(() => {
        navigate({
            pathname: "/view-issue",
            search: `?${createSearchParams([
                ["issueIid", `${issueIid}`],
                ["projectId", `${projectId}`],
            ])}`,
        });
    }, [navigate, issueIid, projectId]);

    const onSubmit = useCallback((data) => {
        if (!client || !projectId || !issueIid) {
            return;
        }

        return createIssueCommentService(client, projectId, issueIid, getIssueCommentValues(data))
            .then(() =>
                queryClient.refetchQueries([QueryKey.ISSUES, QueryKey.COMMENTS, projectId, issueIid])
            )
            .then(() => navigate({
                pathname: "/view-issue",
                search: `?${createSearchParams([
                    ["issueIid", `${issueIid}`],
                    ["projectId", `${projectId}`],
                ])}`,
            }));
    }, [client, navigate, projectId, issueIid]);

    useSetTitle("Add Comment");

    useDeskproElements(({ deRegisterElement, registerElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("plus");
        deRegisterElement("edit");

        registerElement("home", {
            type: "home_button",
            payload: { type: "changePage", path: "/home" },
        });
    });

    return (
        <>
            <IssueCommentForm onSubmit={onSubmit} onCancel={onCancel} />
        </>
    );
};

export { CreateIssueCommentPage };
