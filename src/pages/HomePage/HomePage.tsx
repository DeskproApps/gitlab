import { FC } from "react";
import { useDeskproElements } from "@deskpro/app-sdk";
import { useLoadDependentData } from "./hooks";

const HomePage: FC = () => {
    const { issues } = useLoadDependentData();

    useDeskproElements(({ registerElement }) => {
        registerElement("menu", {
            type: "menu",
            items: [{
                title: "Log Out",
                payload: { type: "logout" },
            }],
        });
    });

    return (
        <>HomePage</>
    )
};

export { HomePage };
