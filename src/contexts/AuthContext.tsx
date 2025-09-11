// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User as FirebaseUser } from "firebase/auth";
import { AuthService } from "../services/firebase/authService";
import { User } from "../types";

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from Firestore
  const loadUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const profile = await AuthService.getCurrentUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading user profile:", error);
      setUserProfile(null);
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await AuthService.signIn(email, password);
      setUser(userCredential.user);
      await loadUserProfile(userCredential.user);
      await AuthService.updateLastLogin();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up
  const signUp = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    try {
      setLoading(true);
      const userCredential = await AuthService.signUp(
        email,
        password,
        userData
      );
      setUser(userCredential.user);
      await loadUserProfile(userCredential.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await AuthService.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await AuthService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      await AuthService.updateProfile(updates);
      await refreshUserProfile();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserProfile(firebaseUser);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
