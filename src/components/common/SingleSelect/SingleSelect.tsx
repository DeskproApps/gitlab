import { FC, useEffect, useState, useMemo } from "react";
import {
    faCheck,
    faCaretDown,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    Dropdown,
    LabelProps,
    DropdownValueType,
    DropdownTargetProps,
    DivAsInputWithDisplay,
    DivAsInputWithDisplayProps,
} from "@deskpro/deskpro-ui";
import { Label } from "../Label";
import type { Option } from "../../../types";

type Props = {
    id: string,
    label?: string,
    error?: DivAsInputWithDisplayProps["error"],
    value: Option<string|number>,
    options: DropdownValueType<string|number>[],
    onChange: (o: Option<string|number>) => void,
    placeholder?: DivAsInputWithDisplayProps["placeholder"],
    showInternalSearch?: boolean,
    required?: LabelProps["required"],
};

const SingleSelect: FC<Props> = ({
    id,
    label,
    error,
    value,
    options,
    onChange,
    required,
    placeholder,
    showInternalSearch,
    ...props
}) => {
    const [input, setInput] = useState<string>("");
    const [dirtyInput, setDirtyInput] = useState<boolean>(false);

    const selectedValue = useMemo(() => {
        return options.filter((o: DropdownValueType<string|number>) => o?.value === value?.value)[0]?.label ?? "";
    }, [value, options]);

    useEffect(() => {
        setInput((value?.label || "Select Value") as string);
    }, [value]);

    return (
        <Dropdown
            showInternalSearch={showInternalSearch}
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="bottom-start"
            hideIcons
            inputValue={!dirtyInput ? "" : input}
            onSelectOption={(selectedOption) => {
                if (!dirtyInput && showInternalSearch) {
                    setDirtyInput(true);
                }
                onChange(selectedOption);
            }}
            onInputChange={(value) => {
                if (showInternalSearch) {
                    !dirtyInput && setDirtyInput(true);
                    setInput(value);
                }
            }}
            options={options.filter((option: DropdownValueType<number|string>) => {
                return !dirtyInput
                    ? true
                    : (option.label as string).includes(input);
            })}
            {...props}
        >
            {({ targetRef, targetProps }: DropdownTargetProps<HTMLDivElement>) => {
                return (
                    <Label htmlFor={id} required={required} label={label}>
                        <DivAsInputWithDisplay
                            id={id}
                            placeholder={placeholder || "Select Value"}
                            value={selectedValue}
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

export { SingleSelect };
