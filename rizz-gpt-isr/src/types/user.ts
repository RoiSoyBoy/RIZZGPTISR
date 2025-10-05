git push -u origin mainimport { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  createdAt: Timestamp;
  tokenCount: number;
  isPremium: boolean;
}
