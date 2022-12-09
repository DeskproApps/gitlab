import { useCallback } from "react";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { TwoButtonGroup } from "@deskpro/app-sdk";
import { Container } from "../../components/common";
import { IssueForm } from "../../components/IssueForm";
import type { FC } from "react";

const CreateIssuePage: FC = () => {
    const navigate = useNavigate();

    const onNavigateToLinkIssue = useCallback(() => navigate("/link"), [navigate]);

    return (
        <Container>
            <TwoButtonGroup
                selected="two"
                oneLabel="Find Issue"
                oneIcon={faSearch}
                twoLabel="Create Issue"
                twoIcon={faPlus}
                oneOnClick={onNavigateToLinkIssue}
                twoOnClick={() => {}}
            />
            <IssueForm />
        </Container>
    );
};

export { CreateIssuePage };
