import { FC, Fragment } from "react";
import {
    LoadingSpinner,
    HorizontalDivider,
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
        registerElement("plusButton", {
            type: "plus_button",
            payload: { type: "changePage", path: "/link" },
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
                <Fragment key={issue.id}>
                    <IssueItem issue={issue} projects={projectOptions} />
                    <HorizontalDivider style={{ margin: "10px 0" }} />
                </Fragment>
            ))}
        </Container>
    )
};

export { HomePage };
