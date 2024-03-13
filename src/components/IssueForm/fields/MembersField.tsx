import { useState } from "react";
import { get } from "lodash";
import { faCaretDown, faCheck, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { DivAsInputWithDisplay, Dropdown, DropdownTargetProps } from "@deskpro/deskpro-ui";
import { Label } from "../../common";
import type { FC } from "react";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { Option } from "../../../types";
import type { Member } from "../../../services/gitlab/types";

type SelectedMember = DropdownValueType<Member["id"]> | undefined;

const MembersField: FC<{
    value: Member["id"],
    options: Array<Option<Member["id"]>>,
    error: boolean,
    onChange: (o: Option<Member["id"]>) => void,
}> = ({ value, options, error, onChange }) => {
    const [inputSearch, setInputSearch] = useState<string>("");
    const selectedMember: SelectedMember = options.find(({ value: memberId }) => memberId === value);

    return (
        <Dropdown
            showInternalSearch
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="bottom-start"
            hideIcons
            options={options.filter(({ description }) => {
                return (description || "").toLowerCase().includes(inputSearch.toLowerCase());
            })}
            onSelectOption={onChange}
            inputValue={inputSearch}
            onInputChange={(value) => setInputSearch(value)}
        >
            {({ targetRef, targetProps }: DropdownTargetProps<HTMLDivElement>) => (
                <Label htmlFor="assignee" label="Assignee">
                    <DivAsInputWithDisplay
                        id="assignee"
                        placeholder="Select Value"
                        value={get(selectedMember, ["label"], "")}
                        variant="inline"
                        rightIcon={faCaretDown}
                        error={error}
                        ref={targetRef}
                        {...targetProps}
                        isVisibleRightIcon={false}
                    />
                </Label>
            )}
        </Dropdown>
    );
};

export { MembersField };
