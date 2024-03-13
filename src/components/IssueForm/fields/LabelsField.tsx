import { faCheck, faExternalLinkAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
    Stack,
    Dropdown,
    Button as ButtonUI,
    DropdownTargetProps,
} from "@deskpro/deskpro-ui";
import { getOption } from "../../../utils";
import { IssueLabel, Label } from "../../common";
import type { FC } from "react";
import type { Option } from "../../../types";
import type { Label as LabelType } from "../../../services/gitlab/types";

const LabelsField: FC<{
    value: Array<LabelType["name"]>,
    labels: LabelType[],
    onChange: (o: Option<LabelType["name"]>) => void,
}> = ({ value, labels, onChange }) => {
    return (
        <Dropdown
            fetchMoreText="Fetch more"
            autoscrollText="Autoscroll"
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="bottom-start"
            searchPlaceholder="Select value"
            options={labels.map((label) => ({
                ...getOption(label.name, (<IssueLabel {...label} />)),
                selected: value.includes(label.name),
            }))}
            closeOnSelect={false}
            onSelectOption={onChange}
        >
            {({targetProps, targetRef}: DropdownTargetProps<HTMLDivElement>) => {
                return (
                    <>
                        <Label
                            {...targetProps}
                            {...{
                                ref: targetRef,
                                htmlFor: "labels",
                                label: "Labels",
                                style: { flexDirection: "column", alignItems: "flex-start" },
                            }}
                        >
                            <ButtonUI
                                minimal
                                text="Add"
                                id="labels"
                                type="button"
                                icon={faPlus}
                            />
                        </Label>
                        <Stack gap={6} wrap="wrap" style={{ marginBottom: 10 }}>
                            {labels
                                .filter(({ name }) => value.includes(name))
                                .map((label) => (
                                    <IssueLabel key={label.name} {...label} />
                                ))
                            }
                        </Stack>
                    </>
                )
            }}
        </Dropdown>
    );
};

export { LabelsField };
