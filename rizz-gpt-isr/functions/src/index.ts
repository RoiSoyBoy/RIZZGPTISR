import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as cors from "cors";
import { OpenAI } from "openai";
import * as dotenv from "dotenv";

dotenv.config();

functions.logger.info("🔑 Environment variables loaded:");
functions.logger.info("OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);

const corsHandler = cors({ origin: true });

admin.initializeApp();

interface GenerateMessageRequest {
  conversationContext: string;
  tone?: "cheerful" | "understanding" | "direct" | "playful" | "confident" | "romantic" | "casual";
  messageType: "reply" | "opener" | "advice";
  bioInfo?: string;
  platform?: string;
  additionalContext?: string;
  screenshotUrl?: string;
}

export const decrementToken = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const tokenId = req.headers.authorization?.split("Bearer ")[1];
    if (!tokenId) {
      res.status(401).send("Unauthorized");
      return;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(tokenId);
      const uid = decodedToken.uid;
      const userRef = admin.firestore().collection("users").doc(uid);

      await admin.firestore().runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          throw new Error("User not found");
        }

        const newTokens = (userDoc.data()?.tokenCount || 0) - 1;
        if (newTokens < 0) {
          throw new Error("Insufficient tokens");
        }

        transaction.update(userRef, {
          tokenCount: newTokens,
          lastUsed: FieldValue.serverTimestamp()
        });
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Transaction failed: ", error);
      res.status(500).send("Transaction failed");
    }
  });
});
export const generateMessage = functions.https.onCall(async (request) => {
  functions.logger.info("=== GENERATE MESSAGE FUNCTION START v3 ===");
  functions.logger.info("📨 RAW REQUEST DATA:", JSON.stringify(request.data, null, 2));

  // Check authentication - onCall provides this automatically
  if (!request.auth) {
    functions.logger.error("❌ No auth in request");
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const uid = request.auth.uid;
  functions.logger.info('✅ Authenticated user:', uid);

  const {
    conversationContext,
    tone,
    messageType,
    bioInfo,
    platform,
    additionalContext,
  }: GenerateMessageRequest = request.data;

  functions.logger.info("🔍 EXTRACTED FIELDS:");
  functions.logger.info("- conversationContext:", conversationContext ? "present" : "MISSING");
  functions.logger.info("- messageType:", messageType ? "present" : "MISSING");
  functions.logger.info("- tone:", tone || "not provided");
  functions.logger.info("- bioInfo:", bioInfo || "not provided");
  functions.logger.info("- platform:", platform || "not provided");
  functions.logger.info("- additionalContext:", additionalContext || "not provided");

  if (!conversationContext || !messageType) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields: conversationContext and messageType');
  }

  functions.logger.info("🔍 Checking user:", uid);

  functions.logger.info("🧪 Testing OpenAI API key connectivity...");
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  functions.logger.info("✅ OpenAI client initialized successfully");

  const userRef = admin.firestore().collection("users").doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    functions.logger.error("❌ User not found in Firestore:", uid);
    throw new functions.https.HttpsError('not-found', 'User not found');
  }

  const tokenCount = userDoc.data()?.tokenCount || 0;
  functions.logger.info("📊 User token count:", tokenCount);

  if (tokenCount <= 0) {
    functions.logger.error("❌ Insufficient tokens:", tokenCount);
    throw new functions.https.HttpsError('failed-precondition', 'Insufficient tokens');
  }

  functions.logger.info("✅ User validation passed, proceeding to OpenAI API call");

  const systemPrompt = `תפקיד ומטרה:
אתה מאמן דייטים כריזמטי ובטוח בעצמו ועוזר הודעות טקסט. המטרה שלך היא לעזור למשתמשים ליצור תגובות מרתקות, פלרטטיות ואותנטיות בשיחות רומנטיות. אתה מתמחה בניתוח שיחות דייטים (באמצעות צילומי מסך או טקסט) וביצירת תגובות שהן:
- מקסימות ומרתקות
- טבעיות ואותנטיות (לא מתוסרטות יתר על המידה)
- מודעות להקשר על בסיס היסטוריית השיחה
- מחזקות ביטחון עצמי

שיטות קלט:
משתמשים יכולים לספק הקשר שיחה בשתי דרכים:
1. העלאת צילום מסך - אתה תנתח את התמונה ותחלץ את השיחה
2. קלט טקסט - משתמשים מדביקים או מקלידים את השיחה ישירות

כאשר מקבל קלט טקסט:
- בקש מהמשתמש לספק את השיחה בפורמט ברור
- פורמט מוצע: "הם: [הודעה]" ו"אתה: [הודעה]" בשורות נפרדות
- אם הפורמט לא ברור, פרש לפי ההקשר או בקש הבהרה
- בקש כל הקשר רלוונטי (מידע ביוגרפי, כמה זמן הם משוחחים, באיזו פלטפורמה)

דוגמה לפורמט קלט טקסט:
\`\`\`
הם: היי! ראיתי שאתה אוהב טיולים
אתה: כן! אני מנסה לצאת כל סוף שבוע
הם: זה מעולה, מה המסלול האהוב עליך?
\`\`\`

התנהגויות ליבה:
1. כאשר מנתח שיחות (צילום מסך או טקסט):
   - קרא את כל הקשר השיחה
   - זהה את סגנון התקשורת, תחומי העניין והטון של האדם השני
   - שים לב לכל מידע ביוגרפי או פרטי פרופיל שסופקו
   - העריך את האווירה הנוכחית (משחקית, רצינית, פלרטטית וכו')
   - קבע מי שלח את ההודעה האחרונה ומה דורש תגובה

2. צור תגובות ש:
   - תואמות את רמת האנרגיה של השיחה
   - מראות עניין אמיתי דרך שאלות המשך
   - משתמשות בהומור בצורה מתאימה (לא מאולץ)
   - יוצרות הזדמנויות להמשך השיחה
   - מאזנות בין ביטחון לכבוד
   - נמנעות מהיות אגרסיביות מדי או מפחידות
   - מקדמות את השיחה קדימה באופן טבעי

3. התאמת טון:
   המשתמש יכול לבחור מטונים אלה ליצירת תגובה:
   - עליז: אופטימי, חיובי, נלהב
   - מבין: אמפטי, מתחשב, מודע רגשית
   - ברור/ישיר: פשוט, כן, ללא שטויות
   - משחקי: מתגרה, שנון, מהנה
   - בטוח: בטוח בעצמו ללא יהירות
   - רומנטי: אמיתי, מתוק, מבטא רגשות
   - קז'ואל: נינוח, ידידותי, ללא לחץ

אסטרטגיית תגובה:
- שמור על תגובות תמציתיות (בדרך כלל 1-3 משפטים להודעות טקסט)
- השתמש בשפה קז'ואלית המתאימה להודעות טקסט/אפליקציות דייטים
- כלול אימוג'ים במשורה ובאופן טבעי (מקסימום 1-2 להודעה)
- צור סקרנות ועניין
- הצע פעילויות או נושאים שמובילים לדייטים כשהזמן נכון
- הימנע מ: מחמאות כלליות, ייאוש, הסבר יתר, שאלות בסגנון ראיון
- שקף את רמת ההשקעה של האדם השני (אורך הודעה, שימוש באימוג'ים, התלהבות)

מודעות להתקדמות שיחה:
- שלב מוקדם (1-10 הודעות): התמקדות בסקרנות, הומור, מציאת קווים משותפים
- שלב ביניים (10-30 הודעות): שאלות עמוקות יותר, חוויות משותפות, בניית קשר
- שלב מתקדם (30+ הודעות): הצע להיפגש, תכנן תוכניות קונקרטיות, שמור על מומנטום

הנחיות:
כאשר עונה לקלט טקסט:
- אם הקשר השיחה מינימלי, בקש פרטים נוספים
- הבהר מי אמר מה אם יש אי בהירות
- בקש העדפת טון אם לא צוין
- ספק אפשרויות תגובה מרובות (2-4) עם הערות אסטרטגיה קצרות

יצירת משפטי פתיחה:
כאשר יוצר משפטי פתיחה:
- התייחס לפרטים ספציפיים מהביו/תמונות שלהם (אם סופקו)
- היה מקורי, לא קלישאה
- הראה אישיות והומור
- צור הזדמנות קלה להם להגיב
- איזן בין סקרנות לנגישות
- התאם לפלטפורמה (לטינדר לעומת הינג' לעומת באמבל יש ווייבים שונים)

מצב ייעוץ דייטים:
כאשר משתמש מבקש ייעוץ כללי (לא תגובות ספציפיות):
- ספק הדרכה ספציפית וניתנת ליישום
- השתמש בדוגמאות כדי להמחיש נקודות
- היה מעודד ותומך
- התייחס לחששות נפוצים (פחד מדחייה, שיחה תקועה וכו')
- למד עקרונות, לא רק תסריטים

פורמט פלט:
**אפשרות 1** (טון: [הטון שנבחר])
[טקסט תגובה]
*אסטרטגיה: [הסבר קצר למה זה עובד]*

**אפשרות 2** (טון: [טון אלטרנטיבי])
[טקסט תגובה]
*אסטרטגיה: [הסבר]*

(המשך עם 2-4 אפשרויות סה"כ)

---

בטיחות ואתיקה:
- לעולם אל תייצר תוכן מטריד, מניפולטיבי או לא מכבד
- כבד סימנים ברורים של חוסר עניין (אל תעודד התנהגות לחוצה)
- קדם חיבור אותנטי, לא הונאה
- סרב לעזור עם: שליחת תוכן מפורש לא רצוי, עקיפת חסימות/גבולות, מניפולציה של אנשים פגיעים
- עודד משתמשים להיות עצמם עם ביטחון מוגבר, לא להעמיד פנים שהם מישהו אחר
- אם השיחה מראה דגלים אדומים (אדם אומר שהוא לא נוח, קטין וכו'), יעץ למשתמש להפסיק

דוגמאות לזרימת שיחה:

דוגמה 1 - קלט טקסט:
משתמש: "הם: אני אוהב לנסות מסעדות חדשות
אתה: גם אני! איזה סוג מטבח?
הם: לאחרונה אני אובססיבי לאוכל תאילנדי"

תגובת העוזר:
**אפשרות 1** (משחקי)
"אוכל תאילנדי מדהים! יש מקום שרציתי לנסות - תקשיב, יש להם תפריט סודי 👀"
*אסטרטגיה: יוצר סקרנות עם התפריט הסודי, מראה שאתה הרפתקן, פותח דלת להצעת פגישה*

**אפשרות 2** (בטוח)
"טעם טוב! אני מכיר את המקום התאילנדי הכי טוב בעיר - צריכים לבדוק אותו ולראות אם הוא עומד באובססיה החדשה שלך"
*אסטרטגיה: הצעה ישירה להיפגש, מראה ביטחון, מתייחס לתחום העניין שלהם*

---

זכור: המטרה שלך היא לעזור למשתמשים לבטא את האישיות האותנטית שלהם עם ביטחון מוגבר, לא ליצור פרסונה מזויפת.
`;

  let userMessage = "";
  if (messageType === "reply") {
    userMessage = `
סוג בקשה: יצירת תגובה
טון מבוקש: ${tone || "קז'ואל"}
${platform ? `פלטפורמה: ${platform}` : ""}
${bioInfo ? `מידע מהפרופיל שלהם: ${bioInfo}` : ""}

הקשר השיחה:
${conversationContext}

${additionalContext ? `הקשר נוסף: ${additionalContext}` : ""}

אנא צור 3-4 אפשרויות תגובה בפורמט שצוין.
`;
  } else if (messageType === "opener") {
    userMessage = `
סוג בקשה: יצירת משפט פתיחה
טון מבוקש: ${tone || "משחקי"}
פלטפורמה: ${platform || "לא צוין"}

${bioInfo ? `המידע מהפרופיל שלהם:\n${bioInfo}` : "לא סופק מידע מהפרופיל"}

${additionalContext ? `הקשר נוסף: ${additionalContext}` : ""}

אנא צור 3-4 משפטי פתיחה מקוריים ומרתקים בפורמט שצוין.
`;
  } else if (messageType === "advice") {
    userMessage = `
סוג בקשה: ייעוץ דייטים כללי
שאלה: ${conversationContext}

${additionalContext ? `הקשר: ${additionalContext}` : ""}

אנא ספק ייעוץ מעשי ומעודד.
`;
  }

  try {
    functions.logger.info("🚀 Making OpenAI API call (gpt-4o-mini)...");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 800,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    });

    const message = response.choices[0].message.content;

    await admin.firestore().runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("User not found");
      }
      const newTokens = (userDoc.data()?.tokenCount || 0) - 1;
      if (newTokens < 0) {
        throw new Error("Insufficient tokens");
      }
      transaction.update(userRef, {
        tokenCount: newTokens,
        lastUsed: FieldValue.serverTimestamp(),
      });
    });

    return {
      success: true,
      message,
      tokensRemaining: (await userRef.get()).data()?.tokenCount,
      model: "gpt-4o-mini",
    };
  } catch (error: any) {
    // Check if the error is about access to gpt-4o-mini, then try fallback
    const isAccessError = error?.status === 403 ||
                         error?.code === 'model_not_found' ||
                         error?.type === 'invalid_request_error';

    if (isAccessError) {
      functions.logger.info("🚫 GPT-4o-mini not available, trying GPT-3.5-turbo fallback...");
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const fallbackResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0.8,
          max_tokens: 800,
          top_p: 0.9,
          frequency_penalty: 0.3,
          presence_penalty: 0.3,
        });

        const message = fallbackResponse.choices[0].message.content;

        await admin.firestore().runTransaction(async (transaction) => {
          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists) {
            throw new Error("User not found");
          }
          const newTokens = (userDoc.data()?.tokenCount || 0) - 1;
          if (newTokens < 0) {
            throw new Error("Insufficient tokens");
          }
          transaction.update(userRef, {
            tokenCount: newTokens,
            lastUsed: FieldValue.serverTimestamp(),
          });
        });

        return {
          success: true,
          message,
          tokensRemaining: (await userRef.get()).data()?.tokenCount,
          model: "gpt-3.5-turbo",
        };
      } catch (fallbackError) {
        functions.logger.error("OpenAI API error (GPT-3.5-turbo fallback):", fallbackError);
        throw new functions.https.HttpsError('internal', 'Error generating message with both models');
      }
    } else {
      functions.logger.error("OpenAI API error (gpt-4o-mini):", error);
      throw new functions.https.HttpsError('internal', 'Error generating message');
    }
  }
});
