import { useDeskproElements } from "@deskpro/app-sdk";
import { useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { useSetTitle } from "../../hooks";
import { useLoadIssueDeps } from "./hooks";
import { ViewIssue } from "../../components/ViewIssue";
import type { FC } from "react";

const ViewIssuePage: FC = () => {
    const [searchParams] = useSearchParams();

    const issueIid = Number(searchParams.get("issueIid") || "");
    const projectId = Number(searchParams.get("projectId") || "");

    const {
        issue,
        project,
        comments,
        isLoading,
        mergeRequests,
    } = useLoadIssueDeps(issueIid, projectId);

    useSetTitle(`${issueIid}`);

     useDeskproElements(({ deRegisterElement, registerElement }) => {
         deRegisterElement("plusButton");

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
        />
    );
};

export { ViewIssuePage };
