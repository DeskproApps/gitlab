import { useCallback } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
    TwoButtonGroup,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityIssueService } from "../../services/entityAssociation";
import { createIssueService, createIssueCommentService } from "../../services/gitlab";
import { useSetTitle } from "../../hooks";
import { getEntityId, getAutomatedLinkedComment } from "../../utils";
import { Container } from "../../components/common";
import { IssueForm, getIssueValues } from "../../components/IssueForm";
import type { FC } from "react";
import type { FormInput } from "../../components/IssueForm";

const CreateIssuePage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();

    const ticketId = get(context, ["data", "ticket", "id"]);
    const permalink = get(context, ["data", "ticket", "permalinkUrl"]);
    const dontAddComment = get(context, ["settings", "dont_add_comment_when_linking_issue"]) === true;

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
                setEntityIssueService(client, ticketId, getEntityId(issue)),
                dontAddComment
                    ? Promise.resolve()
                    : createIssueCommentService(client, projectId, issue.iid, {
                        body: getAutomatedLinkedComment(ticketId, permalink)
                    })
            ]))
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore ToDo: need to fix typings in @app-sdk
            .then((isSuccess: boolean) => {
                if (isSuccess) {
                    navigate("/home")
                }
            });
    }, [client, ticketId, permalink, dontAddComment, navigate]);

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
