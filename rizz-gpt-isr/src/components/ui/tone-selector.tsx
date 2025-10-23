import React, { useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ToneSelectorProps {
  selectedTone: string;
  onToneSelect: (tone: string) => void;
  className?: string;
}

const toneOptions = [
  { id: "casual", label: "רגיל", emoji: "🙌" },
  { id: "romantic", label: "רומנטי", emoji: "💖" },
  { id: "humorous", label: "הומוריסטי", emoji: "😂" },
  { id: "cheerful", label: "עליז", emoji: "😊" },
  { id: "understanding", label: "מבין", emoji: "🤝" },
  { id: "direct", label: "ישיר", emoji: "🎯" },
  { id: "playful", label: "משחקי", emoji: "🎪" },
  { id: "confident", label: "בטוח", emoji: "💪" },
];

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onToneSelect,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("relative", className)}>
      {!isExpanded ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="text-gray-600 hover:text-gray-800"
        >
          🎭 בחר סגנון
        </Button>
      ) : (
        <div className="flex flex-wrap gap-2 bg-white p-3 rounded-lg border shadow-lg">
          {toneOptions.map((tone) => (
            <Button
              key={tone.id}
              variant={selectedTone === tone.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                onToneSelect(tone.id);
                setIsExpanded(false);
              }}
              className={cn(
                "transition-all duration-200",
                selectedTone === tone.id
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-50 border-gray-200"
              )}
            >
              <span className="mr-2">{tone.emoji}</span>
              {tone.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </Button>
        </div>
      )}
    </div>
  );
};

export default ToneSelector;
