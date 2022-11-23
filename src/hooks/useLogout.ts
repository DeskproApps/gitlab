import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { placeholders } from "../services/gitlab";

type UseLogout = () => {
    logout: () => void,
};

const useLogout: UseLogout = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();

    const logout = useCallback(() => {
        if (!client) {
            return;
        }

        client.deleteUserState(placeholders.TOKEN_PATH)
            .then(() => navigate("/login"));
    }, [client, navigate]);

    return { logout };
};

export { useLogout };
