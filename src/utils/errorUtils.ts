// src/utils/errorUtils.ts
/**
 * Handle Firebase error codes and return user-friendly messages
 * @param error Firebase error object
 * @returns User-friendly error message
 */
export const handleFirebaseError = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  const errorCode = error.code || '';
  
  // Auth errors
  if (errorCode.includes('auth')) {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email';
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/email-already-in-use':
        return 'Email is already in use';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/invalid-email':
        return 'Invalid email format';
      case 'auth/requires-recent-login':
        return 'Please log in again to continue';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email';
      case 'auth/popup-closed-by-user':
        return 'Authentication cancelled';
    }
  }
  
  // Firestore errors
  if (errorCode.includes('firestore')) {
    switch (errorCode) {
      case 'firestore/permission-denied':
        return 'You do not have permission to access this resource';
      case 'firestore/not-found':
        return 'The requested document was not found';
      case 'firestore/already-exists':
        return 'The document already exists';
    }
  }
  
  // Storage errors
  if (errorCode.includes('storage')) {
    switch (errorCode) {
      case 'storage/object-not-found':
        return 'File does not exist';
      case 'storage/unauthorized':
        return 'Not authorized to access this file';
      case 'storage/canceled':
        return 'Upload was cancelled';
      case 'storage/retry-limit-exceeded':
        return 'Upload failed, please try again';
    }
  }
  
  // Network errors
  if (errorCode === 'unavailable' || error.message?.includes('network')) {
    return 'Network error. Please check your connection';
  }
  
  // Default/unknown error
  return error.message || 'An unexpected error occurred';
};

/**
 * Create a standardized error response object
 * @param message Error message
 * @param code Error code (optional)
 * @param details Additional error details (optional)
 * @returns Standardized error object
 */
export const createErrorResponse = (
  message: string,
  code?: string,
  details?: any
) => {
  return {
    success: false,
    error: {
      message,
      code,
      details,
      timestamp: new Date().toISOString(),
    }
  };
};

/**
 * Log error to console with additional context
 * @param error Error object
 * @param context Additional context info
 */
export const logError = (error: any, context?: string) => {
  console.error(
    `[ERROR]${context ? ` [${context}]` : ''} ${new Date().toISOString()}:`,
    error
  );
  
  // Add any additional error logging here (e.g., to a service like Firebase Crashlytics)
};

/**
 * Parse and handle specific form validation errors
 * @param errors Form validation errors object
 * @returns Object with field names as keys and error messages as values
 */
export const parseFormErrors = (errors: any): Record<string, string> => {
  const result: Record<string, string> = {};
  
  if (!errors) return result;
  
  Object.keys(errors).forEach(field => {
    const error = errors[field];
    result[field] = error.message || 'Invalid value';
  });
  
  return result;
};