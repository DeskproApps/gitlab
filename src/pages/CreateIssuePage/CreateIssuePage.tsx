import { useCallback } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import get from "lodash.get";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
    TwoButtonGroup,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityIssueService } from "../../services/entityAssociation";
import { createIssueService } from "../../services/gitlab";
import { useSetTitle, useDeskproLabel, useAutomatedComment } from "../../hooks";
import { getEntityId, getEntityMetadata } from "../../utils";
import { Container } from "../../components/common";
import { IssueForm, getIssueValues } from "../../components/IssueForm";
import type { FC } from "react";
import type { FormInput } from "../../components/IssueForm";

const CreateIssuePage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();
    const { createAutomatedLinkedComment } = useAutomatedComment();
    const { addDeskproLabel } = useDeskproLabel();

    const ticketId = get(context, ["data", "ticket", "id"]);

    const onNavigateToLinkIssue = useCallback(() => navigate("/link"), [navigate]);

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

    const onCancel = useCallback(() => navigate("/home"), [navigate]);

    const onSubmit: SubmitHandler<FormInput> = useCallback((data) => {
        if (!client || !ticketId) {
            return;
        }

        const projectId = data.project.value;

        return createIssueService(client, projectId, getIssueValues(data))
            .then((issue) => Promise.all([
                setEntityIssueService(
                    client,
                    ticketId,
                    getEntityId(issue),
                    getEntityMetadata(issue, [data.project])
                ),
                addDeskproLabel(projectId, issue.iid),
                createAutomatedLinkedComment(projectId, issue.iid),
            ]))
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore ToDo: need to fix typings in @app-sdk
            .then((isSuccess: boolean) => {
                if (isSuccess) {
                    navigate("/home")
                }
            });
    }, [client, ticketId, addDeskproLabel, navigate, createAutomatedLinkedComment]);

    return (
        <Container>
            <TwoButtonGroup
                selected="two"
                oneLabel="Find Issue"
                oneIcon={faSearch}
                twoLabel="Create Issue"
                twoIcon={faPlus}
                oneOnClick={onNavigateToLinkIssue}
                twoOnClick={() => {}}
            />
            <IssueForm
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </Container>
    );
};

export { CreateIssuePage };
