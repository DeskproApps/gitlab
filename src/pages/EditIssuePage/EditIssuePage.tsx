import { useCallback } from "react";
import {
    useNavigate,
    useSearchParams,
    createSearchParams,
} from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useSetTitle } from "../../hooks";
import { useLoadIssueDeps } from "./hooks";
import { editIssueService } from "../../services/gitlab";
import { QueryKey, queryClient } from "../../query";
import { Container } from "../../components/common";
import { IssueForm, getIssueValues } from "../../components/IssueForm";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { FormInput } from "../../components/IssueForm";

const EditIssuePage: FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();

    const issueIid = Number(searchParams.get("issueIid") || "");
    const projectId = Number(searchParams.get("projectId") || "");

    const { isLoading, ...params } = useLoadIssueDeps(issueIid, projectId);

    useSetTitle("Edit");

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("plus");
        deRegisterElement("edit");

        registerElement("home", {
            type: "home_button",
            payload: { type: "changePage", path: "/home" },
        });
    });

    const onCancel = useCallback(() => navigate({
        pathname: "/view-issue",
        search: `?${createSearchParams([
            ["issueIid", `${issueIid}`],
            ["projectId", `${projectId}`],
        ])}`
    }), [navigate, issueIid, projectId]);

    const onSubmit: SubmitHandler<FormInput> = useCallback((data) => {
        if (!client || !issueIid || !projectId) {
            return;
        }

        return editIssueService(client, projectId, issueIid, getIssueValues(data))
            .then(() => queryClient.refetchQueries([QueryKey.ISSUES, projectId, issueIid]))
            .then(() => navigate({
                pathname: "/view-issue",
                search: `?${createSearchParams([
                    ["issueIid", `${issueIid}`],
                    ["projectId", `${projectId}`],
                ])}`
            }));
    }, [client, navigate, issueIid, projectId]);

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <Container>
            <IssueForm
                isEditMode
                params={params}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </Container>
    );
};

export { EditIssuePage };
