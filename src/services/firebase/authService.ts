// src/services/firebase/authService.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "./config";
import { FIREBASE_COLLECTIONS } from "../../constants";
import { User } from "../../types";

export class AuthService {
  // Authentication state observer
  static onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Sign in with email and password
  static async signIn(
    email: string,
    password: string
  ): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw this.handleAuthError(error);
    }
  }

  // Sign up with email and password
  static async signUp(
    email: string,
    password: string,
    userData: Partial<User>
  ): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user profile in Firestore
      const userProfile: Omit<User, "id"> = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        role: userData.role || "driver",
        companyId: userData.companyId || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        driverLicense: userData.driverLicense,
        emergencyContact: userData.emergencyContact,
        phoneNumber: userData.phoneNumber,
        profilePicture: userData.profilePicture,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
      };

      await setDoc(
        doc(db, FIREBASE_COLLECTIONS.USERS, userCredential.user.uid),
        userProfile
      );

      // Update Firebase Auth profile
      await updateProfile(userCredential.user, {
        displayName: `${userData.firstName} ${userData.lastName}`,
      });

      return userCredential;
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  // Send password reset email
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw this.handleAuthError(error);
    }
  }

  // Update password
  static async updatePassword(newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      await updatePassword(user, newPassword);
    } catch (error: any) {
      console.error("Update password error:", error);
      throw this.handleAuthError(error);
    }
  }

  // Update email
  static async updateEmail(newEmail: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      await updateEmail(user, newEmail);

      // Update email in Firestore
      await updateDoc(doc(db, FIREBASE_COLLECTIONS.USERS, user.uid), {
        email: newEmail,
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.error("Update email error:", error);
      throw this.handleAuthError(error);
    }
  }

  // Update user profile
  static async updateProfile(updates: Partial<User>): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      // Update Firebase Auth profile if name changed
      if (updates.firstName || updates.lastName) {
        const displayName =
          updates.firstName && updates.lastName
            ? `${updates.firstName} ${updates.lastName}`
            : user.displayName;
        await updateProfile(user, { displayName });
      }

      // Update Firestore profile
      await updateDoc(doc(db, FIREBASE_COLLECTIONS.USERS, user.uid), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw error;
    }
  }

  // Get current user profile from Firestore
  static async getCurrentUserProfile(): Promise<User | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(
        doc(db, FIREBASE_COLLECTIONS.USERS, user.uid)
      );
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error: any) {
      console.error("Get current user profile error:", error);
      throw error;
    }
  }

  // Update last login timestamp
  static async updateLastLogin(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, FIREBASE_COLLECTIONS.USERS, user.uid), {
        lastLoginAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.error("Update last login error:", error);
      // Don't throw here as this is not critical
    }
  }

  // Check if user is authenticated
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Handle Firebase Auth errors
  private static handleAuthError(error: any): Error {
    switch (error.code) {
      case "auth/user-disabled":
        return new Error(
          "This account has been disabled. Please contact support."
        );
      case "auth/user-not-found":
        return new Error("No account found with this email address.");
      case "auth/wrong-password":
        return new Error("Incorrect password. Please try again.");
      case "auth/email-already-in-use":
        return new Error("An account with this email already exists.");
      case "auth/weak-password":
        return new Error("Password should be at least 6 characters.");
      case "auth/invalid-email":
        return new Error("Please enter a valid email address.");
      case "auth/operation-not-allowed":
        return new Error("This sign-in method is not enabled.");
      case "auth/requires-recent-login":
        return new Error("Please sign in again to perform this action.");
      case "auth/too-many-requests":
        return new Error("Too many failed attempts. Please try again later.");
      default:
        return new Error("An unexpected error occurred. Please try again.");
    }
  }
}
