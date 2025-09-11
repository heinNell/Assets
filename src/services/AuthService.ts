// src/services/AuthService.ts
import { useState, useEffect } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { AuthService } from "./firebase/authService";
import { User } from "../types";

export const useAuthService = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const profile = await AuthService.getCurrentUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await AuthService.signIn(email, password);
    await AuthService.updateLastLogin();
    return result;
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    return await AuthService.signUp(email, password, userData);
  };

  const signOutUser = async () => {
    await AuthService.signOut();
  };

  const resetPassword = async (email: string) => {
    await AuthService.resetPassword(email);
  };

  const updatePassword = async (newPassword: string) => {
    await AuthService.updatePassword(newPassword);
  };

  const updateEmail = async (newEmail: string) => {
    await AuthService.updateEmail(newEmail);
  };

  const updateProfile = async (updates: Partial<User>) => {
    await AuthService.updateProfile(updates);
  };

  return {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut: signOutUser,
    resetPassword,
    updatePassword,
    updateEmail,
    updateProfile,
  };
};
