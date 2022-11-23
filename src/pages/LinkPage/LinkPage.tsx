import { FC } from "react";
import { useDeskproElements } from "@deskpro/app-sdk";

const LinkPage: FC = () => {
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
        <>LinkPage</>
    );
};

export { LinkPage };
