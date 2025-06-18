import { has } from "lodash";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, InputWithDisplay } from "@deskpro/deskpro-ui";
import { LoadingSpinner } from "@deskpro/app-sdk";
import {
    Label,
    Button,
    TextArea,
} from "../common";
import { useLoadIssueFormDeps } from "./hooks";
import { getInitValues, validationSchema } from "./utils";
import {
    TypeField,
    LabelsField,
    ProjectField,
    MembersField,
    MilestoneField,
} from "./fields";
import type { FC } from "react";
import type { Props } from "./types";

const IssueForm: FC<Props> = ({ isEditMode = false, onSubmit, onCancel, params }) => {
    const {
        watch,
        setValue,
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
        // @todo: Replace any with FormInput, The FormInput type needs to be refactored.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = useForm<any>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        defaultValues: getInitValues(params) as any,
        resolver: yupResolver(validationSchema),
    });
    const [
        title,
        description,
        type,
        project,
        milestone,
        assignee,
        labels,
        // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
        // @ts-ignore will fix in v8 https://github.com/react-hook-form/react-hook-form/issues/4055#issuecomment-1171531617
    ] = watch(["title", "description", "type", "project", "milestone", "assignee", "labels"]);

    const {
        isLoading,
        memberOptions,
        projectOptions,
        milestoneOptions,
        labels: labelItems,
    } = useLoadIssueFormDeps({ projectId: project.value });

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="title" label="Title" required>
                <InputWithDisplay
                    id="title"
                    type="text"
                    inputsize="small"
                    placeholder="Enter title"
                    value={title}
                    error={has(errors, ["title", "message"])}
                    {...register("title")}
                />
            </Label>

            <Label htmlFor="description" label="Description">
                <TextArea
                    minHeight="auto"
                    placeholder="Enter description"
                    value={description}
                    error={has(errors, ["description", "message"])}
                    {...register("description")}
                />
            </Label>

            {!isEditMode && <ProjectField
                value={project}
                options={projectOptions}
                error={has(errors, ["project", "value", "message"])}
                onChange={(option) => setValue("project", option)}
            />}

            <TypeField
                value={type}
                error={has(errors, ["type", "value", "message"])}
                onChange={(option) => setValue("type", option)}
            />

            <MilestoneField
                value={milestone}
                options={milestoneOptions}
                error={has(errors, ["milestone", "value", "message"])}
                onChange={(option) => setValue("milestone", option)}
            />

            <MembersField
                value={assignee}
                options={memberOptions}
                error={has(errors, ["assignee", "value", "message"])}
                onChange={(option) => setValue("assignee", option.value)}
            />

            <LabelsField
                value={labels}
                labels={labelItems}
                onChange={(option) => {
                    if (option.value) {
                        const selectedLabels = Array.isArray(labels) ? labels : [];
                        const newValue = selectedLabels.includes(option.value)
                            ? selectedLabels.filter((name) => name !== option.value)
                            : [...selectedLabels, option.value];

                        setValue("labels", newValue);
                    }
                }}
            />

            <Stack justify="space-between">
                <Button
                    type="submit"
                    text={isEditMode ? "Save" : "Create"}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                />
                {onCancel && <Button text="Cancel" intent="tertiary" onClick={onCancel} />}
            </Stack>
        </form>
    );
};

export { IssueForm };
