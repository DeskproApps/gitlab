import { FC } from "react";
import {
    LoadingSpinner,
    useDeskproElements,
} from "@deskpro/app-sdk";
import { useLoadDependentData } from "./hooks";
import { IssueItem } from "../../components";
import { Container } from "../../components/common";

const HomePage: FC = () => {
    const { issues, projectOptions, isLoading } = useLoadDependentData();

    useDeskproElements(({ registerElement }) => {
        registerElement("menu", {
            type: "menu",
            items: [{
                title: "Log Out",
                payload: { type: "logout" },
            }],
        });
    });

    if (isLoading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <Container>
            {issues.map((issue) => (
                <IssueItem key={issue.id} issue={issue} projects={projectOptions} />
            ))}
        </Container>
    )
};

export { HomePage };
