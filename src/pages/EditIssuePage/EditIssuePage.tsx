import { useCallback } from "react";
import get from "lodash/get";
import {
    useNavigate,
    useSearchParams,
    createSearchParams,
} from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useSetTitle } from "../../hooks";
import { useLoadIssueDeps } from "./hooks";
import { setEntityIssueService } from "../../services/entityAssociation";
import { editIssueService } from "../../services/gitlab";
import { getEntityId, getEntityMetadata } from "../../utils";
import { QueryKey, queryClient } from "../../query";
import { Container } from "../../components/common";
import { IssueForm, getIssueValues } from "../../components/IssueForm";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { FormInput } from "../../components/IssueForm";
import type { TicketContext } from "../../types";

const EditIssuePage: FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };

    const ticketId = get(context, ["data", "ticket", "id"]);
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
        if (!client || !issueIid || !projectId || !ticketId) {
            return;
        }

        return editIssueService(client, projectId, issueIid, getIssueValues(data))
            .then((issue) => {
                return setEntityIssueService(
                    client,
                    ticketId,
                    getEntityId(issue),
                    getEntityMetadata(issue, [data.project]),
                );
            })
            .then(() => queryClient.refetchQueries([QueryKey.ISSUES, projectId, issueIid]))
            .then(() => navigate({
                pathname: "/view-issue",
                search: `?${createSearchParams([
                    ["issueIid", `${issueIid}`],
                    ["projectId", `${projectId}`],
                ])}`
            }));
    }, [client, navigate, issueIid, projectId, ticketId]);

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
