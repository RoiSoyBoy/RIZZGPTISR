"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMessageStore } from "@/store/message-store";
import { useAuth } from "@/context/AuthContext";
import { generateMessage } from "@/services/api";

type MessageType = "reply" | "opener" | "advice";
type ToneType = "cheerful" | "understanding" | "direct" | "playful" | "confident" | "romantic" | "casual";

export default function DashboardPage() {
  const {
    context,
    tone,
    messageType,
    bioInfo,
    platform,
    additionalContext,
    isLoading,
    suggestions,
    setContext,
    setTone,
    setMessageType,
    setBioInfo,
    setPlatform,
    setAdditionalContext,
    setLoading,
    setSuggestions,
  } = useMessageStore();
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  const handleGenerate = async () => {
    try {
      // Validate inputs first
      if (!context?.trim() || context.trim().length < 2) {
        alert('אנא הזן הקשר שיחה (לפחות 2 תווים)');
        return;
      }

      if (!messageType) {
        alert('אנא בחר סוג הודעה');
        return;
      }

      console.log('🔵 Calling generateMessage...');

      // Build request
      const requestData = {
        conversationContext: context.trim(),
        messageType: messageType || "reply", // Ensure default
        tone: tone || "casual",
        bioInfo: bioInfo?.trim() || undefined,
        platform: platform?.trim() || undefined,
        additionalContext: additionalContext?.trim() || undefined,
      };

      // Remove undefined fields
      Object.keys(requestData).forEach(key => {
        if (requestData[key as keyof typeof requestData] === undefined) {
          delete requestData[key as keyof typeof requestData];
        }
      });

      console.log('📦 Request:', requestData);

      // Call the function
      const result = await generateMessage(requestData);

      console.log('✅ Response:', result.data);

      // Handle response
      const responseData = result.data as {
        success?: boolean;
        message?: string;
        tokensRemaining?: number;
        model?: string;
        error?: string;
      };

      if (responseData.success && responseData.message) {
        setSuggestions([responseData.message]);
        console.log('📊 Tokens remaining:', responseData.tokensRemaining);
        console.log('🤖 Model used:', responseData.model);
        alert('הצלחה! הודעות נוצרו');
      } else {
        alert('שגיאה: ' + (responseData.error || 'תגובה לא תקינה מהשרת'));
      }

    } catch (error: any) {
      console.error('❌ Error:', error);

      if (error.code === 'unauthenticated') {
        alert('אנא התחבר מחדש');
      } else if (error.code === 'invalid-argument') {
        alert('נתונים שגויים: ' + error.message);
      } else if (error.code === 'permission-denied') {
        alert('אין לך מספיק הודעות - אנא שדרג את החשבון');
      } else {
        alert('שגיאה: ' + error.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-right">
        יצירת הודעה
      </h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>הכנס הקשר וסגנון</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">סוג הודעה</label>
            <Select
              onValueChange={setMessageType}
              value={messageType}
              defaultValue="reply"
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר סוג הודעה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reply">תגובה</SelectItem>
                <SelectItem value="opener">משפט פתיחה</SelectItem>
                <SelectItem value="advice">ייעוץ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="הכנס את הקשר השיחה כאן..."
            value={context}
            onInput={(e) => setContext(e.currentTarget.value)}
            className="min-h-[150px]"
          />

          <div>
            <label className="block text-sm font-medium mb-2">סגנון</label>
            <Select onValueChange={setTone} value={tone}>
              <SelectTrigger>
                <SelectValue placeholder="בחר סגנון" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">רגיל</SelectItem>
                <SelectItem value="romantic">רומנטי</SelectItem>
                <SelectItem value="humorous">הומוריסטי</SelectItem>
                <SelectItem value="cheerful">עליז</SelectItem>
                <SelectItem value="understanding">מבין</SelectItem>
                <SelectItem value="direct">ישיר</SelectItem>
                <SelectItem value="playful">משחקי</SelectItem>
                <SelectItem value="confident">בטוח</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="מידע ביוגרפי מהפרופיל (אופציונלי)"
            value={bioInfo}
            onInput={(e) => setBioInfo(e.currentTarget.value)}
            className="min-h-[80px]"
          />

          <Textarea
            placeholder="הקשר נוסף (אופציונלי)"
            value={additionalContext}
            onInput={(e) => setAdditionalContext(e.currentTarget.value)}
            className="min-h-[80px]"
          />
          <Button
            disabled={isLoading || authLoading}
            onClick={handleGenerate}
            className="w-full"
          >
            {isLoading ? "יוצר..." : "צור הודעה"}
          </Button>
        </CardContent>
      </Card>
      {suggestions.length > 0 && (
        <Card className="w-full max-w-2xl mx-auto mt-4">
          <CardHeader>
            <CardTitle>הצעות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <p key={index} className="text-right">
                {suggestion}
              </p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
