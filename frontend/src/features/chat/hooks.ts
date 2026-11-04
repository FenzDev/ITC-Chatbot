import { useMutation } from "@tanstack/react-query";
import { sendChat } from "./api";

export const useSendChat = () => useMutation({ mutationFn: sendChat });
