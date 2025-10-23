// import { httpsCallable } from "firebase/functions";
import { httpsCallable } from "firebase/functions";
import { functions, auth } from "@/lib/firebase";

export const generateMessage = httpsCallable(functions, "generateMessage");

// Alternative implementation with better error handling and debugging
export const generateMessageWithDebug = async (data: any) => {
  try {
    console.log("🔧 Calling generateMessageWithDebug...");
    console.log("📊 Request data:", data);

    const result = await generateMessage(data);

    console.log("✅ Raw result from function:", result);
    console.log("📋 Result data:", result.data);

    // Firebase onCall returns the data directly in the result, not wrapped in a .data property
    return result;
  } catch (error: any) {
    console.error("❌ Detailed error from generateMessageWithDebug:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error details:", error.details);

    // Re-throw to maintain error handling in components
    throw error;
  }
};

export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  return await user.getIdToken();
};
