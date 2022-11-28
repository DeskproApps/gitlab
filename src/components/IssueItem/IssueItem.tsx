import { FC, useState, MouseEvent } from "react";
import styled from "styled-components";
import { match } from "ts-pattern";
import get from "lodash/get";
import capitalize from "lodash/capitalize";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@deskpro/deskpro-ui";
import {
    P5,
    Pill,
    Stack,
    useDeskproAppTheme,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { Title, Property, TwoProperties } from "../common";
import { format } from "../../utils/date";
import { getEntityAssociationCountService } from "../../services/entityAssociation";
import type { Option } from "../../types";
import type { Issue } from "../../services/gitlab/types";

const State: FC<{ state?: "opened"|"closed" }> = ({ state }) => {
    const { theme } = useDeskproAppTheme();
    const [bg, label] = match(state)
        .with("opened", () => [theme.colors.green100, "Open"])
        .with("closed", () => [theme.colors.cyan100, "Closed"])
        .otherwise(() => [theme.colors.grey80, capitalize(state)])

    return (
        <Pill
            label={label}
            textColor={theme.colors.white}
            backgroundColor={bg}
        />
    );
};

const TitleLink = styled.a`
    color: ${({ theme }) => theme.colors.cyan100};
    text-decoration: none;
`;

const Assignees: FC<{ assignees?: Issue["assignees"] }> = ({ assignees }) => {
    return (!Array.isArray(assignees) || !assignees.length)
        ? <>-</>
        : (
            <Stack wrap="wrap" gap={6}>
                {assignees.map(({ id, name, avatar_url }) => (
                    <Stack gap={6} key={id}>
                        <Avatar
                            size={18}
                            name={name}
                            backupIcon={faUser}
                            {...(avatar_url ? { imageUrl: avatar_url } : {})}
                        />
                        <P5>{name}</P5>
                    </Stack>
                ))}
            </Stack>
        );
};

const IssueItem: FC<{
    issue: Issue,
    projects: Array<Option<string|Issue["project_id"]>>
    onClickTitle: () => void,
}> = ({
    issue: {
        id,
        iid,
        title,
        web_url,
        created_at,
        project_id,
        assignees,
        state,
    } = {},
    projects,
    onClickTitle,
}) => {
    const [ticketCount, setTicketCount] = useState<number>(0);

    const project = projects.find(({ value }) => value === project_id);

    const onClick = (e: MouseEvent) => {
        e.preventDefault();
        onClickTitle();
    };

    useInitialisedDeskproAppClient((client) => {
        getEntityAssociationCountService(client, `${id}`).then(setTicketCount);
    });

    return (
        <>
            <Title
                title={(
                    <TitleLink href="#" onClick={onClick}>
                        {title}
                    </TitleLink>
                )}
                link={web_url}
            />
            <TwoProperties
                leftLabel="State"
                leftText={<State state={state}/>}
                rightLabel="Date Created"
                rightText={format(created_at)}
            />
            <TwoProperties
                leftLabel="Issue ID"
                leftText={iid}
                rightLabel="Project"
                rightText={get(project, ["label"], "-")}
            />

            <Property
                label="Asignees"
                text={<Assignees assignees={assignees} />}
            />
            <Property
                label="Deskpro Tickets"
                text={ticketCount}
            />
        </>
    );
};

export { IssueItem };