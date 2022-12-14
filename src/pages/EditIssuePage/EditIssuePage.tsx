import { useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { useLoadIssueDeps } from "./hooks";
import type { FC } from "react";

const EditIssuePage: FC = () => {
    const [searchParams] = useSearchParams();

    const issueIid = Number(searchParams.get("issueIid") || "");
    const projectId = Number(searchParams.get("projectId") || "");

    const { issue, isLoading } = useLoadIssueDeps(issueIid, projectId);

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <>
            EditIssuePage
        </>
    );
};

export { EditIssuePage };
