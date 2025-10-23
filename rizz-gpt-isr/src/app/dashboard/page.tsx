"use client";

import { useEffect, useRef } from "react";
import ChatInput from "@/components/ui/chat-input";
import ChatMessage from "@/components/ui/chat-message";
import { useMessageStore } from "@/store/message-store";
import { useAuth } from "@/context/AuthContext";
import { generateMessage } from "@/services/api";

export default function DashboardPage() {
  const {
    messages,
    isLoading,
    selectedTone,
    selectedMessageType,
    bioInfo,
    additionalContext,
    setSelectedTone,
    setSelectedMessageType,
    setBioInfo,
    setAdditionalContext,
    setLoading,
    addMessage,
    updateLastMessage,
    setSuggestions,
  } = useMessageStore();
  const { user, loading: authLoading } = useAuth();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">טוען...</div>
      </div>
    );
  }

  const handleSendMessage = async (content: string, metadata: {
    tone: string;
    messageType: string;
  }) => {
    // Add user message to chat
    addMessage(content, "user", {
      tone: metadata.tone,
      messageType: metadata.messageType,
      bioInfo: bioInfo?.trim() || undefined,
      additionalContext: additionalContext?.trim() || undefined,
    });

    setLoading(true);

    try {
      console.log('🔵 Calling generateMessage...');

      // Build request
      const requestData = {
        conversationContext: content.trim(),
        messageType: metadata.messageType,
        tone: metadata.tone,
        bioInfo: bioInfo?.trim() || undefined,
        additionalContext: additionalContext?.trim() || undefined,
      };

      // Remove undefined fields
      Object.keys(requestData).forEach(key => {
        if (requestData[key as keyof typeof requestData] === undefined) {
          delete requestData[key as keyof typeof requestData];
        }
      });

      console.log('📦 Request:', requestData);

      // Add loading message
      addMessage("", "ai", { isLoading: true });

      // Call the original function (remove debug wrapper)
      const result = await generateMessage(requestData);

      console.log('🔍 Full result object:', result);
      console.log('🔍 Result.data type:', typeof result.data);
      console.log('🔍 Result.data keys:', result.data ? Object.keys(result.data) : 'N/A');

      // Firebase callable functions return data in result.data
      const responseData = result.data || result;

      console.log('🔍 responseData type:', typeof responseData);
      console.log('🔍 responseData contents:', JSON.stringify(responseData, null, 2));

      console.log('🔍 Using responseData:', responseData);
      console.log('🔍 Final responseData structure:', {
        hasSuccess: responseData.hasOwnProperty('success'),
        successValue: responseData.success,
        hasMessage: responseData.hasOwnProperty('message'),
        messageValue: responseData.message,
        messageLength: responseData.message?.length
      });

      if (responseData.success && responseData.message) {
        console.log('✅ Valid response received, updating UI...');
        // Update the loading message with actual content
        updateLastMessage(responseData.message, {
          tone: metadata.tone,
          messageType: metadata.messageType,
        });
        // Also update legacy suggestions for compatibility
        setSuggestions([responseData.message]);
        console.log('📊 Tokens remaining:', responseData.tokensRemaining);
        console.log('🤖 Model used:', responseData.model);
      } else {
        console.log('❌ Invalid response structure, showing error...');
        // Update with error message
        const errorMessage = responseData.error || 'תגובה לא תקינה מהשרת';
        console.log('Error reason:', errorMessage);
        updateLastMessage(`שגיאה: ${errorMessage}`, {
          tone: metadata.tone,
          messageType: metadata.messageType,
        });
      }

    } catch (error: any) {
      console.error('❌ Error:', error);

      let errorMessage = 'שגיאה: ' + error.message;

      if (error.code === 'unauthenticated') {
        errorMessage = 'אנא התחבר מחדש';
      } else if (error.code === 'invalid-argument') {
        errorMessage = 'נתונים שגויים: ' + error.message;
      } else if (error.code === 'permission-denied') {
        errorMessage = 'אין לך מספיק הודעות - אנא שדרג את החשבון';
      }

      // Update loading message with error
      updateLastMessage(errorMessage, {
        tone: selectedTone,
        messageType: selectedMessageType,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            RizzGPT ISR
          </h1>
          <div className="text-sm text-gray-500">
            {messages.length === 0 ? 'התחל שיחה חדשה' : `${messages.length} הודעות`}
          </div>
        </div>
      </div>

      {/* Chat container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {messages.length === 0 ? (
            // Empty state
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  ברוכים הבאים ל-RizzGPT ISR
                </h2>
                <p className="text-gray-600">
                  הכנס הקשר שיחה או העלה צילום מסך כדי לקבל הצעות הודעות אישיות
                </p>
              </div>
              <div className="w-full max-w-md text-center">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="p-4 bg-white rounded-lg border">
                    💬 תגובות מושכות
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    🌟 משפטי פתיחה
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    💡 ייעוץ וטיפים
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    📸 ניתוח צילומי מסך
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Messages
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-1">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    content={message.content}
                    type={message.type}
                    timestamp={message.timestamp}
                    isLoading={message.metadata?.isLoading}
                  />
                ))}
              </div>
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Chat input */}
          <div className="border-t border-gray-200 bg-white px-4 py-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              selectedTone={selectedTone}
              selectedMessageType={selectedMessageType}
              onToneChange={setSelectedTone}
              onMessageTypeChange={setSelectedMessageType}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>


    </div>
  );
}
