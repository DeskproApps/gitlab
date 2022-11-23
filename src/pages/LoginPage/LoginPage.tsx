import { FC } from "react";
import { H3, useDeskproElements } from "@deskpro/app-sdk";
import { useLogin } from "./hooks";
import { Title, AnchorButton } from "../../components/common";
import { ErrorBlock } from "../../components";

const LoginPage: FC = () => {
    const { error, authLink, isLoading, onSignIn } = useLogin();

    useDeskproElements(({ deRegisterElement }) => {
        deRegisterElement("menu");
    });

    if (error) {
        // eslint-disable-next-line no-console
        console.error(`GitLab LogIn: ${error}`);
    }

    return (
        <>
            <Title as={H3} title="Log into your GitLab Account" />
            {error && <ErrorBlock text="An error occurred, please try again."/>}
            <AnchorButton
                text="Log In"
                target="_blank"
                href={authLink}
                onClick={onSignIn}
                loading={isLoading}
                disabled={isLoading}
            />
        </>
    );
};

export { LoginPage };
