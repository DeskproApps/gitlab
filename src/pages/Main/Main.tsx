import { FC } from "react";
import { useCheckLinkedIssues } from "./hooks";

export const Main: FC = () => {
    useCheckLinkedIssues();

    return null;
};
