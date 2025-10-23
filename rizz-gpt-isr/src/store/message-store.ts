import { create } from "zustand";

interface ChatMessage {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
  metadata?: {
    tone?: string;
    messageType?: string;
    bioInfo?: string;
    additionalContext?: string;
    isLoading?: boolean;
  };
}

interface MessageState {
  messages: ChatMessage[];
  currentContext: string;
  selectedTone: string;
  selectedMessageType: string;
  bioInfo: string;
  additionalContext: string;
  isLoading: boolean;
  // Legacy form state for compatibility
  context: string;
  tone: string;
  messageType: string;
  platform: string;
  suggestions: string[];
  // Actions
  addMessage: (content: string, type: "user" | "ai", metadata?: ChatMessage["metadata"]) => void;
  setCurrentContext: (context: string) => void;
  setSelectedTone: (tone: string) => void;
  setSelectedMessageType: (messageType: string) => void;
  setBioInfo: (bioInfo: string) => void;
  setAdditionalContext: (additionalContext: string) => void;
  setLoading: (isLoading: boolean) => void;
  // Legacy setters for backward compatibility
  setContext: (context: string) => void;
  setTone: (tone: string) => void;
  setMessageType: (messageType: string) => void;
  setPlatform: (platform: string) => void;
  setSuggestions: (suggestions: string[]) => void;
  clearChat: () => void;
  updateLastMessage: (content: string, metadata?: ChatMessage["metadata"]) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  // Chat state
  messages: [],
  currentContext: "",
  selectedTone: "casual",
  selectedMessageType: "reply",
  bioInfo: "",
  additionalContext: "",
  isLoading: false,

  // Legacy form state for compatibility
  context: "",
  tone: "casual",
  messageType: "reply",
  platform: "",
  suggestions: [],

  // Chat actions
  addMessage: (content, type, metadata) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        content,
        type,
        timestamp: new Date(),
        metadata,
      },
    ],
  })),

  setCurrentContext: (currentContext) => set({ currentContext }),
  setSelectedTone: (selectedTone) => set({ selectedTone }),
  setSelectedMessageType: (selectedMessageType) => set({ selectedMessageType }),
  setBioInfo: (bioInfo) => set({ bioInfo }),
  setAdditionalContext: (additionalContext) => set({ additionalContext }),
  setLoading: (isLoading) => set({ isLoading }),

  // Legacy setters for backward compatibility - also update new state
  setContext: (context) => set({ context, currentContext: context }),
  setTone: (tone) => set({ tone, selectedTone: tone }),
  setMessageType: (messageType) => set({ messageType, selectedMessageType: messageType }),
  setPlatform: (platform) => set({ platform }),
  setSuggestions: (suggestions) => set({ suggestions }),

  clearChat: () => set({ messages: [] }),

  updateLastMessage: (content, metadata) => set((state) => ({
    messages: state.messages.map((msg, index) =>
      index === state.messages.length - 1
        ? { ...msg, content, metadata: { ...msg.metadata, ...metadata, isLoading: false }, timestamp: new Date() }
        : msg
    ),
  })),
}));
