import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { InputWithDisplay } from "@deskpro/deskpro-ui";
import { Stack, Button as ButtonUI } from "@deskpro/app-sdk";
import {
    Label,
    Button,
    TextArea,
    SingleSelect,
} from "../common";
import { getOption } from "../../utils";
import type { FC } from "react";

const IssueForm: FC = () => {
    const isEditMode = true;

    return (
        <form>
            <Label htmlFor="title" label="Title" required>
                <InputWithDisplay
                    id="title"
                    type="text"
                    inputsize="small"
                    placeholder="Enter title"
                />
            </Label>

            <Label htmlFor="description" label="Description">
                <TextArea
                    minHeight="auto"
                    placeholder="Enter description"
                />
            </Label>

            <Label htmlFor="type" label="Type">
                <SingleSelect
                    showInternalSearch
                    id="repository"
                    value={getOption("issue", "Issue")}
                    options={[getOption("issue", "Issue"), getOption("incident", "Incident")]}
                    onChange={() => {}}
                />
            </Label>

            <Label htmlFor="project" label="Project">
                <SingleSelect
                    showInternalSearch
                    id="Project"
                    value={getOption("01", "Project 1")}
                    options={[getOption("01", "Project 1"), getOption("02", "Project 2")]}
                    onChange={() => {}}
                />
            </Label>

            <Label htmlFor="milestone" label="Milestone">
                <SingleSelect
                    showInternalSearch
                    id="milestone"
                    value={getOption("01", "Milestone 1")}
                    options={[getOption("01", "Milestone 1"), getOption("02", "Milestone 2")]}
                    onChange={() => {}}
                />
            </Label>

            <Label htmlFor="assignees" label="Assignees">
                <SingleSelect
                    showInternalSearch
                    id="assignees"
                    value={getOption("01", "Armen Tamzarian")}
                    options={[getOption("01", "Armen Tamzarian"), getOption("02", "Vasia Pupkin")]}
                    onChange={() => {}}
                />
            </Label>

            <Label htmlFor="labels" label="Labels" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <ButtonUI text="Add" minimal icon={faPlus} />
            </Label>

            <Stack justify="space-between">
                <Button type="submit" text={isEditMode ? "Save" : "Create"} />
                <Button text="Cancel" intent="tertiary" onClick={() => {}} />
            </Stack>
        </form>
    );
};

export { IssueForm };
