import type { DropdownValueType } from "@deskpro/app-sdk";
import type { Option } from "../types";

const getOption = <Value>(
    value: Value,
    label: DropdownValueType<Value>["label"],
): Option<Value> => ({
    label,
    value,
    key: `${value}`,
    type: "value",
});

export { getOption };
