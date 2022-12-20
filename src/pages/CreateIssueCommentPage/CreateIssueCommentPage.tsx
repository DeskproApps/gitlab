import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDeskproElements } from "@deskpro/app-sdk";
import type { FC } from "react";

const CreateIssueCommentPage: FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const issueIid = Number(searchParams.get("issueIid") || "");
    const projectId = Number(searchParams.get("projectId") || "");

    useDeskproElements(({ deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("plus");
        deRegisterElement("edit");
    });

    return (
        <>
            CreateIssueCommentPage
        </>
    );
};

export { CreateIssueCommentPage };
