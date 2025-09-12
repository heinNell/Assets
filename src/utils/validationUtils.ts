// src/utils/validationUtils.ts
/**
 * Validate email format
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (basic validation)
 * @param phone Phone number to validate
 * @returns Boolean indicating if phone number is valid
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if we have 10-11 digits (US format)
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Validate vehicle registration/license plate
 * @param plate License plate to validate
 * @returns Boolean indicating if license plate is valid
 */
export const isValidLicensePlate = (plate: string): boolean => {
  if (!plate) return false;
  
  // Remove spaces and standardize
  const cleaned = plate.replace(/\s+/g, '').toUpperCase();
  
  // Basic validation - at least 4 characters, alphanumeric
  return cleaned.length >= 4 && /^[A-Z0-9]+$/.test(cleaned);
};

/**
 * Validate if string is not empty and meets minimum length
 * @param value String to validate
 * @param minLength Minimum length required
 * @returns Boolean indicating if string is valid
 */
export const isValidString = (value: string, minLength = 1): boolean => {
  if (!value) return false;
  return value.trim().length >= minLength;
};

/**
 * Validate number within range
 * @param value Number to validate
 * @param min Minimum value
 * @param max Maximum value
 * @returns Boolean indicating if number is valid
 */
export const isValidNumber = (
  value: number, 
  min?: number, 
  max?: number
): boolean => {
  if (value === null || value === undefined || isNaN(value)) return false;
  
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  
  return true;
};

/**
 * Validate QR code format for fleet vehicles
 * @param qrData QR code data string
 * @returns Boolean indicating if QR code has valid format
 */
export const isValidFleetQR = (qrData: string): boolean => {
  if (!qrData) return false;
  
  // Format: FLEET_{REGISTRATION}_{FLEETNO}_{TIMESTAMP}_{RANDOM}
  const parts = qrData.split('_');
  
  if (parts.length !== 5) return false;
  if (parts[0] !== 'FLEET') return false;
  
  // Check if registration part is valid
  return isValidLicensePlate(parts[1]);
};