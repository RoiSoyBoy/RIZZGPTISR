import React from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  type: "user" | "ai";
  timestamp: Date;
  isLoading?: boolean;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  type,
  timestamp,
  isLoading = false,
  className,
}) => {
  const isRTL = content && /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(content);

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        type === "user" ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-2xl shadow-sm",
          type === "user"
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-gray-100 border border-gray-200 text-gray-900 rounded-bl-md",
          isLoading && "animate-pulse"
        )}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-gray-500">כותב...</span>
          </div>
        ) : (
          <>
            <p className={cn("text-sm leading-relaxed break-words whitespace-pre-wrap", isRTL && "text-right")}>
              {content}
            </p>
            <span className="text-xs opacity-60 mt-1 block">
              {timestamp.toLocaleTimeString('he-IL', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
