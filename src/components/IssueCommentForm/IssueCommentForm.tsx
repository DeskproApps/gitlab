import { has } from "lodash";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "@deskpro/app-sdk";
import { getInitValues, validationSchema } from "./utils";
import { Label, Button, Container, TextArea } from "../common";
import type { FC } from "react";
import type { Props, FormInput } from "./types";

const IssueCommentForm: FC<Props> = ({ onCancel, onSubmit }) => {
    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInput>({
        defaultValues: getInitValues(),
        resolver: yupResolver(validationSchema),
    });
    const [comment] = watch(["comment"]);

    return (
        <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Label htmlFor="comment" label="New comment" required>
                    <TextArea
                        minHeight="auto"
                        placeholder="Enter comment"
                        value={comment}
                        error={has(errors, ["comment", "message"])}
                        {...register("comment")}
                    />
                </Label>

                <Stack justify="space-between">
                    <Button
                        type="submit"
                        text="Add"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                    />
                    <Button text="Cancel" intent="tertiary" onClick={onCancel} />
                </Stack>
            </form>
        </Container>
    );
};

export { IssueCommentForm };
