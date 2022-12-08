import { default as fnsFormat } from "date-fns/format";
import { FORMAT } from "./constants";
import { DateTime, Maybe } from "../../types";

const format = (date: Maybe<DateTime>, pattern = FORMAT): string => {
    if (!date) {
        return "-";
    }

    return fnsFormat(new Date(date), pattern);
};

export { format };
