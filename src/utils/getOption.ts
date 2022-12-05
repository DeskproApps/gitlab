import { ReactNode } from "react";
import { Option } from "../types";

const getOption = <Value, >(
    value: Value,
    label: ReactNode,
): Option<Value> => ({
    label,
    value,
    key: value,
    type: "value",
});

export { getOption };
