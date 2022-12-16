import { useState } from "react";
import { faCaretDown, faCheck, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { DivAsInputWithDisplay } from "@deskpro/deskpro-ui";
import { Dropdown, DropdownTargetProps } from "@deskpro/app-sdk";
import { Label } from "../../common";
import type { FC } from "react";
import type { Option } from "../../../types";
import type { Milestone } from "../../../services/gitlab/types";

const MilestoneField: FC<{
    value: Option<Milestone["id"]>,
    options: Array<Option<Milestone["id"]>>,
    error: boolean,
    onChange: (o: Option<Milestone["id"]>) => void,
}> = ({ value, options, error, onChange }) => {
    const [inputSearch, setInputSearch] = useState<string>("");

    return (
        <Dropdown
            showInternalSearch
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="bottom-start"
            hideIcons
            options={options.filter(({ label }) => {
                return (label as string).toLowerCase().includes(inputSearch.toLowerCase());
            })}
            onSelectOption={onChange}
            inputValue={inputSearch}
            onInputChange={setInputSearch}
        >
            {({ targetRef, targetProps }: DropdownTargetProps<HTMLDivElement>) => {
                return (
                    <Label htmlFor="milestone" label="Milestone">
                        <DivAsInputWithDisplay
                            id="milestone"
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

export { MilestoneField };
