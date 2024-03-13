import { useMemo } from "react";
import styled from "styled-components";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import ReactTimeAgo from "react-time-ago";
import { Avatar } from "@deskpro/deskpro-ui";
import { P1, P11, Stack } from "@deskpro/deskpro-ui";
import { mdToHtml } from "../../utils";
import {
    Title,
    Container,
} from "../common";
import type { FC } from "react";
import type { Props } from "./types";

const TimeAgo = styled(ReactTimeAgo)`
    color: ${({ theme }) => theme.colors.grey80};
`;

const Author = styled(Stack)`
    width: 35px;
`;

const Comment = styled(P1)`
    width: calc(100% - 35px);
    white-space: pre-line;
    
    p {
        white-space: pre-wrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 0;
    }
    
    p:first-child {
        margin-top: 0;
    }
    
    img {
        width: 100%;
        height: auto;
    }
`;

const Comments: FC<Pick<Props, "comments"|"onCreateIssueComment">> = ({ comments, onCreateIssueComment }) => {
    const count = (Array.isArray(comments) && comments.length > 0) ? comments.length : 0;
    const isEmptyComments = useMemo(() => {
        return !(Array.isArray(comments) && comments.length > 0);
    }, [comments]);

    return (
        <Container>
            <Title title={`Comments (${count})`} onClick={onCreateIssueComment} />

            {!isEmptyComments && comments.map(({ id, body, updated_at, author }) => (
                <Stack key={id} wrap="nowrap" gap={6} style={{ marginBottom: 10 }}>
                    <Author vertical>
                        <Avatar
                            size={18}
                            name={author.name}
                            backupIcon={faUser}
                            imageUrl={author.avatar_url}
                        />
                        <P11>
                            <TimeAgo date={new Date(updated_at)} timeStyle="mini" />
                        </P11>
                    </Author>
                    <Comment dangerouslySetInnerHTML={{ __html: mdToHtml(body) }} />
                </Stack>
            ))}
        </Container>
    );
};

export { Comments };
