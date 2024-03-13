import { faUser } from "@fortawesome/free-solid-svg-icons";
import { P5, Stack, Avatar } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { AvatarProps, ImageAvatarProps } from "@deskpro/deskpro-ui";

export type Props = {
    name: AvatarProps["name"],
    icon?: AvatarProps["backupIcon"],
    avatarUrl?: ImageAvatarProps["imageUrl"],
};

const Member: FC<Props> = ({ name, icon, avatarUrl }) => (
    <Stack gap={6}>
        <Avatar
            size={18}
            name={name}
            backupIcon={icon || faUser}
            {...(avatarUrl ? { imageUrl: avatarUrl } : {})}
        />
        <P5>{name}</P5>
    </Stack>
);

export { Member };
