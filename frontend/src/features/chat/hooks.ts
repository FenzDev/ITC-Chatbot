import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearChatHistory,
  getAssistantContext,
  getChatHistory,
  sendChat,
  updateAssistantContext,
} from "./api";
import type { ChatMessage } from "./types";

export const chatHistoryKey = ["chat", "history"] as const;

export const useSendChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendChat,
    onSuccess: (reply, message) => {
      queryClient.setQueryData(chatHistoryKey, (history: ChatMessage[] = []) => [
        ...history,
        { role: "user", content: message },
        { role: "assistant", content: reply },
      ]);
    },
  });
};

export const useChatHistory = (enabled: boolean) =>
  useQuery({ queryKey: chatHistoryKey, queryFn: getChatHistory, enabled, retry: false });

export const useClearChatHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearChatHistory,
    onSuccess: () => queryClient.setQueryData(chatHistoryKey, []),
  });
};

export const assistantContextKey = ["chat", "context"] as const;

export const useAssistantContext = (enabled: boolean) =>
  useQuery({
    queryKey: assistantContextKey,
    queryFn: getAssistantContext,
    enabled,
    retry: false,
  });

export const useUpdateAssistantContext = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAssistantContext,
    onSuccess: (context) => {
      queryClient.setQueryData(assistantContextKey, context);
    },
  });
};
