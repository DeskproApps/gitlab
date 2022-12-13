import { faCaretDown, faCheck, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { DivAsInputWithDisplay } from "@deskpro/deskpro-ui";
import { Dropdown, DropdownTargetProps } from "@deskpro/app-sdk";
import { Label } from "../common";
import type { FC } from "react";
import type { Option } from "../../types";
import { getOption } from "../../utils";

const TypeField: FC<{
    value: Option<"issue"|"incident">,
    error: boolean,
    onChange: (o: Option<"issue"|"incident">) => void,
}> = ({ value, error, onChange }) => {
    return (
        <Dropdown
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="bottom-start"
            hideIcons
            options={[
                getOption<"issue">("issue", "Issue"),
                getOption<"incident">("incident", "Incident"),
            ]}
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
