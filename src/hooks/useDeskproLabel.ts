import { useCallback, useMemo } from "react";
import { get } from "lodash";
import {
    useDeskproAppTheme,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import {
    getIssueService,
    editIssueService,
    getProjectLabelsService,
    createProjectLabelService,
} from "../services/gitlab";
import type { TicketContext } from "../types";
import type { Issue, Project, Label } from "../services/gitlab/types";

type UseDeskproLabel = () => {
    addDeskproLabel: (projectId: Project["id"], issueIid: Issue["iid"]) => Promise<Issue|void>,
    removeDeskproLabel: (projectId: Project["id"], issueIid: Issue["iid"]) => Promise<Issue|void>,
};

const useDeskproLabel: UseDeskproLabel = () => {
    const { client } = useDeskproAppClient();
    const { theme } = useDeskproAppTheme();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };

    const deskproLabel = useMemo(() => ({
        name: "Deskpro",
        color: theme.colors.cyan100,
    }), [theme.colors.cyan100]);

    const dontAddDeskproLabel = get(context, ["settings", "dont_add_deskpro_label"]) === true;

    const addDeskproLabel = useCallback((projectId: Project["id"], issueIid: Issue["iid"]) => {
        if (dontAddDeskproLabel || !client) {
            return Promise.resolve();
        }

        return getProjectLabelsService(client, projectId)
            .then<Label|void>((labels) => {
                if (labels.some(({ name }) => name.toLowerCase() === deskproLabel.name.toLowerCase())) {
                    return Promise.resolve();
                } else {
                    return createProjectLabelService(client, projectId, deskproLabel)
                }
            })
            .then(() => getIssueService(client, projectId, issueIid))
            .then((issues) => {
                const labels = issues[0].labels.map(({ name }) => name).concat([deskproLabel.name]).join(",");
                return editIssueService(client, projectId, issueIid, { labels });
            })
            .catch(() => {});
    }, [client, deskproLabel, dontAddDeskproLabel]);

    const removeDeskproLabel = useCallback((projectId: Project["id"], issueIid: Issue["iid"]) => {
        if (dontAddDeskproLabel || !client) {
            return Promise.resolve();
        }

        return getIssueService(client, projectId, issueIid)
            .then((issues) => {
                const labels = issues[0].labels
                    .map(({ name }) => name)
                    .filter((label) => label.toLowerCase() !== deskproLabel.name.toLowerCase())
                    .join(",");
                return editIssueService(client, projectId, issueIid, { labels });
            })
            .catch(() => {})
    }, [client, deskproLabel, dontAddDeskproLabel]);

    return { addDeskproLabel, removeDeskproLabel };
};

export { useDeskproLabel };
