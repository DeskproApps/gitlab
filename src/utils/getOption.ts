import type { DropdownValueType } from "@deskpro/deskpro-ui";
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
