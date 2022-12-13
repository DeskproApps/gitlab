import { useState } from "react";
import has from "lodash/has";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputWithDisplay } from "@deskpro/deskpro-ui";
import { Stack } from "@deskpro/app-sdk";
import {
    Label,
    Button,
    TextArea,
} from "../common";
import { useLoadIssueFormDeps } from "./hooks";
import { getInitValues, validationSchema } from "./utils";
import { MembersField } from "./MembersField";
import { MilestoneField } from "./MilestoneField";
import { TypeField } from "./TypeField";
import { ProjectField } from "./ProjectField";
import { LabelsField } from "./LabelsField";
import type { FC } from "react";
import type { Props, FormInput } from "./types";

const IssueForm: FC<Props> = ({ onSubmit, onCancel }) => {
    const [isEditMode] = useState(true);
    const hookForm = useForm<FormInput>({
        defaultValues: getInitValues(),
        resolver: yupResolver(validationSchema),
    });
    const { watch, setValue, register, formState, handleSubmit } = hookForm;
    const { errors, isSubmitting } = formState;
    const [
        title,
        description,
        type,
        project,
        milestone,
        assignees,
        labels,
    // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
    // @ts-ignore will fix in v8 https://github.com/react-hook-form/react-hook-form/issues/4055#issuecomment-1171531617
    ] = watch(["title", "description", "type", "project", "milestone", "assignees", "labels"]);

    const {
        labels: labelItems,
        memberOptions,
        projectOptions,
        milestoneOptions,
    } = useLoadIssueFormDeps({ projectId: project.value });

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

            <ProjectField
                value={project}
                options={projectOptions}
                error={has(errors, ["project", "value", "message"])}
                onChange={(option) => setValue("project", option)}
            />

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
                value={assignees}
                options={memberOptions}
                error={has(errors, ["assignees", "value", "message"])}
                onChange={(option) => setValue("assignees", option)}
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
