import { FC } from "react";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import {
    H3,
    useDeskproElements,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useLogin } from "./hooks";
import { getEntityIssueListService } from "../../services/entityAssociation";
import { Title, AnchorButton, Container } from "../../components/common";
import { ErrorBlock } from "../../components";
import type { TicketContext } from "../../types";

const LoginPage: FC = () => {
    const navigate = useNavigate();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const {
        error,
        isAuth,
        authLink,
        onSignIn,
        isLoading,
    } = useLogin();
    const ticketId = get(context, ["data", "ticket", "id"]);

    useDeskproElements(({ deRegisterElement }) => {
        deRegisterElement("menu");
    });

    /** redirect after authorized */
    useInitialisedDeskproAppClient((client) => {
        if (!ticketId || !isAuth) {
            return;
        }

        getEntityIssueListService(client, ticketId)
            .then((entities) => {
                if (Array.isArray(entities) && entities.length > 0) {
                    navigate("/home");
                } else {
                    navigate("/link");
                }
            });
    }, [ticketId, isAuth]);

    if (error) {
        // eslint-disable-next-line no-console
        console.error(`GitLab LogIn: ${error}`);
    }

    return (
        <Container>
            <Title as={H3} title="Log into your GitLab Account" />
            {error && <ErrorBlock text="An error occurred, please try again."/>}
            <AnchorButton
                text="Log In"
                target="_blank"
                href={authLink}
                onClick={onSignIn}
                loading={isLoading}
                disabled={isLoading}
            />
        </Container>
    );
};

export { LoginPage };
