import { faCaretDown, faCheck, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { DivAsInputWithDisplay, Dropdown, DropdownTargetProps } from "@deskpro/deskpro-ui";
import { getIssueTypes } from "../../../utils";
import { Label } from "../../common";
import type { FC } from "react";
import type { IssueType } from "../../../services/gitlab/types";
import type { Option } from "../../../types";

const TypeField: FC<{
    value: Option<IssueType>,
    error: boolean,
    onChange: (o: Option<IssueType>) => void,
}> = ({ value, error, onChange }) => {
    return (
        <Dropdown
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="bottom-start"
            hideIcons
            options={Object.values(getIssueTypes()) as Array<Option<IssueType>>}
            onSelectOption={onChange}
        >
            {({ targetRef, targetProps }: DropdownTargetProps<HTMLDivElement>) => {
                return (
                    <Label htmlFor="type" label="Type">
                        <DivAsInputWithDisplay
                            id="type"
                            placeholder="Select Value"
                            value={value.label || ""}
                            variant="inline"
                            rightIcon={faCaretDown}
                            error={error}
                            ref={targetRef}
                            {...targetProps}
                            isVisibleRightIcon={false}
                        />
                    </Label>
                )
            }}
        </Dropdown>
    );
};

export { TypeField };
