import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";

// Initialize Firebase Admin SDK
// Use emulator when running locally, production otherwise
if (process.env.FIREBASE_PROJECT_ID === "demo-project-id") {
  // Emulator configuration
  admin.initializeApp({
    projectId: "demo-project-id",
    credential: admin.credential.applicationDefault()
  });
} else {
  // Production configuration
  admin.initializeApp();
}

setGlobalOptions({ maxInstances: 10 });

// TEST FUNCTION - Keep this simple to debug
export const testMessage = onCall(async (request) => {
  console.log('🧪 TEST FUNCTION STARTED');
  console.log('User ID:', request.auth?.uid);
  console.log('Data received:', JSON.stringify(request.data, null, 2));

  // Simple validation
  if (!request.auth) {
    console.log('❌ No auth');
    throw new HttpsError('unauthenticated', 'Must be logged in');
  }

  console.log('✅ Auth OK');

  return {
    success: true,
    message: "Test function working!",
    timestamp: new Date().toISOString(),
    user: request.auth.uid
  };
});
