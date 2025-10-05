import { httpsCallable } from "firebase/functions";
import { functions, auth } from "@/lib/firebase";

export const generateMessage = httpsCallable(functions, "generateMessage");

export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  return await user.getIdToken();
};
