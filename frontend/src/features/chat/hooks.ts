import { useMutation, useQuery } from "@tanstack/react-query";
import { getChatHistory, sendChat } from "./api";

export const useSendChat = () => useMutation({ mutationFn: sendChat });
export const useChatHistory = (enabled: boolean) =>
  useQuery({ queryKey: ["chat", "history"], queryFn: getChatHistory, enabled, retry: false });
