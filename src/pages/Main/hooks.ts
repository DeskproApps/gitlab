import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import {
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getCurrentUserService } from "../../services/gitlab";
import { getEntityCardListService } from "../../services/entityAssociation";
import type { TicketContext } from "../../types";

const useCheckLinkedIssues = () => {
    const navigate = useNavigate();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const ticketId = get(context, ["data", "ticket", "id"]);

    useInitialisedDeskproAppClient(async (client) => {
        if (!ticketId) {
            return;
        }

        const isAuth = await getCurrentUserService(client)
            .then((data) => Boolean(get(data, ["currentUser", "id"], null)))

        if (!isAuth) {
            navigate("/login");
            return;
        }

        const entities = await getEntityCardListService(client, ticketId);

        if (Array.isArray(entities) && entities.length > 0) {
            navigate("/home");
        } else {
            navigate("/link");
        }
    }, [ticketId]);
};

export { useCheckLinkedIssues };
