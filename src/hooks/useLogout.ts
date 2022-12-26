import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { placeholders } from "../services/gitlab";

type UseLogout = () => {
    isLoading: boolean,
    logout: () => void,
};

const useLogout: UseLogout = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const logout = useCallback(() => {
        if (!client) {
            return;
        }

        setIsLoading(true);
        client.deleteUserState(placeholders.TOKEN_PATH)
            .then(() => {
                client?.setBadgeCount(0);
                setIsLoading(false);
                navigate("/login");
            });
    }, [client, navigate]);

    return { logout, isLoading };
};

export { useLogout };
