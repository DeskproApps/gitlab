import { FC, Fragment } from "react";
import {
    Stack,
    Checkbox,
    HorizontalDivider,
} from "@deskpro/app-sdk";
import { getEntityId } from "../../utils";
import {
    Card,
    Button,
    Search,
    NoFound,
    CardBody,
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
    isSubmitting: boolean,
    onChange: SearchProps["onChange"],
    onClear: SearchProps["onClear"],
    selectedProject: Option<string|Issue["project_id"]>,
    onChangeSelect: (o: Option<Issue["project_id"]|"any">) => void,
    selectedIssues: string[],
    projectOptions: Array<Option<string|Issue["project_id"]>>,
    onLinkIssues: () => void,
    onCancel: () => void,
    issues: Issue[],
    onChangeSelectedIssue: (issue: Issue) => void,
};

const LinkIssue: FC<Props> = ({
    value,
    isFetching,
    isSubmitting,
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
        <>
            <Search
                value={value}
                isFetching={isFetching}
                onChange={onChange}
                onClear={onClear}
            />
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <SingleSelect onChange={onChangeSelect}
                id="group"
                label="Group"
                value={selectedProject}
                options={projectOptions as DropdownValueType<Issue["project_id"]>[]}
                showInternalSearch
            />
            <Stack justify="space-between" style={{ paddingBottom: "4px" }}>
                <Button
                    disabled={selectedIssues.length === 0 || isSubmitting}
                    loading={isSubmitting}
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
                ? (<NoFound text="No GitLab issues found" />)
                : issues.map((issue) => (
                        <Fragment key={issue.id}>
                            <Card>
                                <CardMedia>
                                    <Checkbox
                                        size={12}
                                        checked={selectedIssues.includes(getEntityId(issue))}
                                        onChange={() => onChangeSelectedIssue(issue)}
                                        containerStyle={{ marginTop: 2 }}
                                    />
                                </CardMedia>
                                <CardBody>
                                    <IssueItem
                                        issue={issue}
                                        projects={projectOptions}
                                        onClickTitle={() => onChangeSelectedIssue(issue)}
                                    />
                                </CardBody>
                            </Card>
                            <HorizontalDivider style={{ margin: "10px 0" }} />
                        </Fragment>
                    ))
            }
        </>
    );
};

export { LinkIssue };
