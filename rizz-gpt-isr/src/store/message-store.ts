import { create } from "zustand";

interface MessageState {
  context: string;
  tone: string;
  messageType: string;
  bioInfo: string;
  platform: string;
  additionalContext: string;
  isLoading: boolean;
  suggestions: string[];
  setContext: (context: string) => void;
  setTone: (tone: string) => void;
  setMessageType: (messageType: string) => void;
  setBioInfo: (bioInfo: string) => void;
  setPlatform: (platform: string) => void;
  setAdditionalContext: (additionalContext: string) => void;
  setLoading: (isLoading: boolean) => void;
  setSuggestions: (suggestions: string[]) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  context: "",
  tone: "casual",
  messageType: "reply",
  bioInfo: "",
  platform: "",
  additionalContext: "",
  isLoading: false,
  suggestions: [],
  setContext: (context) => set({ context }),
  setTone: (tone) => set({ tone }),
  setMessageType: (messageType) => set({ messageType }),
  setBioInfo: (bioInfo) => set({ bioInfo }),
  setPlatform: (platform) => set({ platform }),
  setAdditionalContext: (additionalContext) => set({ additionalContext }),
  setLoading: (isLoading) => set({ isLoading }),
  setSuggestions: (suggestions) => set({ suggestions }),
}));
