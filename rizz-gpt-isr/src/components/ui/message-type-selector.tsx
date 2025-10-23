import React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface MessageTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
  className?: string;
}

const messageTypes = [
  { id: "reply", label: "תגובה", emoji: "💬" },
  { id: "opener", label: "פתיחה", emoji: "🌟" },
  { id: "advice", label: "ייעוץ", emoji: "💡" },
];

export const MessageTypeSelector: React.FC<MessageTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  className,
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {messageTypes.map((type) => (
        <Button
          key={type.id}
          variant={selectedType === type.id ? "default" : "outline"}
          size="sm"
          onClick={() => onTypeSelect(type.id)}
          className={cn(
            "transition-all duration-200",
            selectedType === type.id
              ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
              : "hover:bg-gray-50 border-gray-200"
          )}
        >
          <span className="mr-2">{type.emoji}</span>
          {type.label}
        </Button>
      ))}
    </div>
  );
};

export default MessageTypeSelector;
