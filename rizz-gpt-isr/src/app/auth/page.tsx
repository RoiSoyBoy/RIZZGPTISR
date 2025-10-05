"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {showLogin ? <LoginForm /> : <SignUpForm />}
      <button onClick={() => setShowLogin(!showLogin)}>
        {showLogin ? "צריך להירשם?" : "כבר יש לך חשבון?"}
      </button>
    </div>
  );
}
