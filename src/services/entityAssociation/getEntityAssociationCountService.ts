import { ENTITY_GITLAB_ISSUE } from "./constants";
import type { IDeskproClient } from "@deskpro/app-sdk";

const getEntityAssociationCountService = (client: IDeskproClient, id: string) => {
    return client.entityAssociationCountEntities(ENTITY_GITLAB_ISSUE, id);
};

export { getEntityAssociationCountService };
