import get from "lodash.get";
import isEmpty from "lodash.isempty";
import { P5, Stack } from "@deskpro/app-sdk";
import { format } from "../../utils/date";
import { mdToHtml } from "../../utils";
import {
    Title,
    State,
    Member,
    Property,
    IconLink,
    Container,
    IssueLabel,
    OverflowText,
    TwoProperties,
} from "../common";
import { nbsp } from "../../constants";
import type { FC } from "react";
import type { Props } from "./types";

const Info: FC<Pick<Props, "issue"|"project">> = ({ issue, project }) => {
    const projectName = get(project, ["name"]);
    const milestone = get(issue, ["milestone", "title"]);

    return (
        <Container>
            <Title
                title={get(issue, ["title"], "-")}
                link={get(issue, ["web_url"], "#")}
            />
            <Property
                label="Description"
                text={(
                    <P5 dangerouslySetInnerHTML={{ __html: mdToHtml(get(issue, ["description"], "-")) || "-" }}/>
                )}
            />
            <TwoProperties
                leftLabel="State"
                leftText={<State state={get(issue, ["state"])} />}
                rightLabel="Date Created"
                rightText={format(get(issue, ["created_at"]))}
            />
            <TwoProperties
                leftLabel="Issue ID"
                leftText={get(issue, ["iid"], "-")}
                rightLabel="Project"
                rightText={projectName
                    ? (
                        <P5 style={{ display: "flex" }}>
                            <OverflowText>{projectName}{nbsp}</OverflowText>
                            <IconLink href={get(project, ["web_url"], "")}/>
                        </P5>
                    )
                    : "-"
                }
            />
            <TwoProperties
                leftLabel="Due date"
                leftText={format(get(issue, ["due_date"]))}
                rightLabel="Milestone"
                rightText={milestone
                    ? (
                        <P5 style={{ display: "flex" }}>
                            <OverflowText>{milestone}{nbsp}</OverflowText>
                            <IconLink href={get(issue, ["milestone", "web_url"], "-")} />
                        </P5>
                    )
                    : "-"
                }
            />
            <Property
                label="Author"
                text={(
                    <Member
                        name={get(issue, ["author", "name"], "-")}
                        avatarUrl={get(issue, ["author", "avatar_url"])}
                    />
                )}
            />
            <Property
                label="Assignees"
                text={(
                    <>
                        {isEmpty(issue?.assignees) ? "-" : issue?.assignees?.map((assignee) => (
                            <Member
                                key={assignee.username}
                                name={assignee.name}
                                avatarUrl={assignee.avatar_url}
                            />
                        ))}
                    </>
                )}
            />
            <Property
                label="Labels"
                text={(
                    <Stack wrap="wrap" gap={6}>
                        {isEmpty(issue?.labels) ? "-" : (issue?.labels || []).map((label) => (
                            <IssueLabel key={label.id} {...label} />
                        ))}
                    </Stack>
                )}
            />
        </Container>
    );
};

export { Info };
