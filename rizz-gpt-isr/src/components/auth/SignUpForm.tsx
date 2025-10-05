"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Create a document in Firestore with initial token count.
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        tokenCount: 50,
        isPremium: false,
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>הרשמה</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="אימייל"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="סיסמה"
        required
      />
      <button type="submit">הירשם</button>
      {error && <p>{error}</p>}
    </form>
  );
}
