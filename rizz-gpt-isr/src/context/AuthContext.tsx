"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isUsingEmulators } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("AuthContext: Auth state changed, user:", !!user, user?.email);
      setUser(user);
      setLoading(false);

      // Only set token in production, emulator doesn't generate real tokens
      if (user && !isUsingEmulators()) {
        try {
          const token = await user.getIdToken();
          document.cookie = `firebaseIdToken=${token}; path=/; max-age=604800`; // 1 week
        } catch (error) {
          console.error("Failed to get ID token:", error);
        }
      } else if (!user) {
        document.cookie =
          "firebaseIdToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
