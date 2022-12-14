import { LoadingSpinner } from "@deskpro/app-sdk";
import { useCheckLinkedIssues } from "./hooks";
import type { FC } from "react";

export const Main: FC = () => {
    useCheckLinkedIssues();

    return (
        <LoadingSpinner/>
    );
};
