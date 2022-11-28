import { FC, Fragment } from "react";
import {
    Stack,
    Checkbox,
    HorizontalDivider,
} from "@deskpro/app-sdk";
import {
    Card,
    Button,
    Search,
    NoFound,
    CardBody,
    Container,
    CardMedia,
    SingleSelect,
} from "../common";
import { IssueItem } from "../IssueItem";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { Props as SearchProps } from "../common/Search";
import type { Issue } from "../../services/gitlab/types";
import type { Option } from "../../types";

type Props = {
    value: string,
    isLoading: boolean,
    isFetching: boolean,
    onChange: SearchProps["onChange"],
    onClear: SearchProps["onClear"],
    selectedProject: Option<string|Issue["project_id"]>,
    onChangeSelect: (o: Option<string|Issue["project_id"]>) => void,
    selectedIssues: Array<Issue["id"]>,
    projectOptions: Array<Option<string|Issue["project_id"]>>,
    onLinkIssues: () => void,
    onCancel: () => void,
    issues: Issue[],
    onChangeSelectedIssue: (issueId: Issue["id"]) => void,
};

const LinkIssue: FC<Props> = ({
    value,
    isFetching,
    onChange,
    onClear,
    selectedProject,
    onChangeSelect,
    selectedIssues,
    projectOptions,
    onLinkIssues,
    onCancel,
    issues,
    onChangeSelectedIssue,
}) => {
    return (
        <Container>
            <Search
                value={value}
                isFetching={isFetching}
                onChange={onChange}
                onClear={onClear}
            />
            <SingleSelect
                id="group"
                label="Group"
                value={selectedProject}
                options={projectOptions as DropdownValueType<Issue["project_id"]>[]}
                showInternalSearch
                onChange={onChangeSelect}
            />
            <Stack justify="space-between" style={{ paddingBottom: "4px" }}>
                <Button
                    disabled={selectedIssues.length === 0}
                    text="Link Issue"
                    onClick={onLinkIssues}
                />
                <Button
                    text="Cancel"
                    onClick={onCancel}
                    intent="secondary"
                />
            </Stack>

            <HorizontalDivider style={{ marginBottom: 10 }} />

            {!Array.isArray(issues)
                ? (<NoFound/>)
                : issues.length === 0
                ? (<NoFound text="No GitHub issues found" />)
                : issues.map((issue) => (
                        <Fragment key={issue.id}>
                            <Card>
                                <CardMedia>
                                    <Checkbox
                                        size={12}
                                        checked={selectedIssues.includes(issue.id)}
                                        onChange={() => onChangeSelectedIssue(issue.id)}
                                        containerStyle={{ marginTop: 2 }}
                                    />
                                </CardMedia>
                                <CardBody>
                                    <IssueItem
                                        issue={issue}
                                        projects={projectOptions}
                                        onClickTitle={() => onChangeSelectedIssue(issue.id)}
                                    />
                                </CardBody>
                            </Card>
                            <HorizontalDivider style={{ margin: "10px 0" }} />
                        </Fragment>
                    ))
            }
        </Container>
    );
};

export { LinkIssue };