"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      console.log("Attempting login...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase login successful:", userCredential.user.email);

      // Wait for auth state to propagate to the middleware
      await new Promise(resolve => {
        let tries = 0;
        const checkInterval = setInterval(() => {
          tries++;
          if (tries > 10) { // Max 1 second
            clearInterval(checkInterval);
            resolve(true);
            return;
          }
          // Check if cookie was set (middleware will redirect based on this)
          if (document.cookie.includes('firebaseIdToken') || document.cookie.match(/firebaseIdToken=[^;]+/)) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
      });

      console.log("Redirecting to dashboard...");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>התחברות</h2>
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
      <button type="submit">התחבר</button>
      {error && <p>{error}</p>}
    </form>
  );
}
