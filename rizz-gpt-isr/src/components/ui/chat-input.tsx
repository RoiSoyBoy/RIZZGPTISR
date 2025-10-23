import React, { useState, useRef, useCallback } from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";
import MessageTypeSelector from "./message-type-selector";
import ToneSelector from "./tone-selector";

interface ChatInputProps {
  onSendMessage: (content: string, metadata: {
    tone: string;
    messageType: string;
    bioInfo?: string;
    additionalContext?: string;
  }) => void;
  selectedTone: string;
  selectedMessageType: string;
  onToneChange: (tone: string) => void;
  onMessageTypeChange: (type: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  selectedTone,
  selectedMessageType,
  onToneChange,
  onMessageTypeChange,
  isLoading = false,
  placeholder = "הכנס הקשר שיחה או העלה צילום מסך...",
  className,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim() || isLoading) return;

    const content = inputValue.trim();
    const metadata = {
      tone: selectedTone,
      messageType: selectedMessageType,
    };

    onSendMessage(content, metadata);
    setInputValue("");
    setIsExpanded(false);

    // Focus back to input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [inputValue, selectedTone, selectedMessageType, onSendMessage, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Auto-expand textarea when typing
    if (e.target.scrollHeight > e.target.clientHeight) {
      setIsExpanded(true);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Options panel (shown above input when expanded) */}
      {isExpanded && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
          <div className="flex flex-col sm:flex-row gap-3">
            <MessageTypeSelector
              selectedType={selectedMessageType}
              onTypeSelect={onMessageTypeChange}
            />
            <ToneSelector
              selectedTone={selectedTone}
              onToneSelect={onToneChange}
            />
          </div>
        </div>
      )}

      {/* Input container */}
      <div className="relative">
        <Textarea
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={cn(
            "min-h-[56px] max-h-[200px] resize-none rounded-2xl border-gray-200 shadow-sm",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "pr-12 pl-4" // Space for buttons
          )}
          disabled={isLoading}
          rows={1}
        />

        {/* Action buttons */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          {/* Screenshot upload button (placeholder for now) */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 rounded-full"
            disabled={isLoading}
          >
            📸
          </Button>

          {/* Options toggle */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "h-8 w-8 p-0 rounded-full transition-colors",
              isExpanded
                ? "text-blue-500 bg-blue-50"
                : "text-gray-400 hover:text-gray-600"
            )}
            disabled={isLoading}
          >
            ⚙️
          </Button>

          {/* Send button */}
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            className={cn(
              "h-8 w-8 p-0 rounded-full transition-all",
              inputValue.trim() && !isLoading
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {isLoading ? "⏳" : "➤"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
