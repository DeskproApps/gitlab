import { FC } from "react";
import { useDeskproElements } from "@deskpro/app-sdk";

const HomePage: FC = () => {
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
