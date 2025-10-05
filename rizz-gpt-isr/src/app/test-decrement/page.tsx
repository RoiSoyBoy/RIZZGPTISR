"use client";

import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from "@/context/AuthContext";

export default function TestDecrementPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState("Ready to test.");

  const handleDecrement = async () => {
    if (!user) {
      setStatus("You must be logged in to test.");
      return;
    }

    setStatus("Calling decrementToken function...");
    const functions = getFunctions();
    const decrementToken = httpsCallable(functions, "decrementToken");

    try {
      const result = await decrementToken();
      console.log("Function result:", result);
      setStatus("Successfully called decrementToken function.");
    } catch (error) {
      console.error("Error calling function:", error);
      setStatus("Failed to call decrementToken function.");
    }
  };

  return (
    <div>
      <h1>Test Decrement Token Function</h1>
      <button onClick={handleDecrement} disabled={!user}>
        Decrement Token
      </button>
      <p>Status: {status}</p>
    </div>
  );
}
