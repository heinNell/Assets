// src/utils/formatUtils.ts
/**
 * Format currency based on locale (default: USD)
 * @param amount Amount to format
 * @param currency Currency code (default: USD)
 * @param locale Locale string (default: en-US)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number, 
  currency = 'USD', 
  locale = 'en-US'
): string => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format distance in kilometers or miles
 * @param distanceInMeters Distance in meters
 * @param useImperial Whether to use imperial units (miles) instead of metric (km)
 * @returns Formatted distance string
 */
export const formatDistance = (
  distanceInMeters: number,
  useImperial = false
): string => {
  if (distanceInMeters === null || distanceInMeters === undefined) return '';
  
  if (useImperial) {
    // Convert to miles (1 meter = 0.000621371 miles)
    const miles = distanceInMeters * 0.000621371;
    return miles < 0.1 
      ? `${Math.round(miles * 5280)} ft` // Show in feet if less than 0.1 miles
      : `${miles.toFixed(1)} mi`;
  } else {
    // Convert to kilometers
    const km = distanceInMeters / 1000;
    return km < 0.1 
      ? `${Math.round(distanceInMeters)} m` // Show in meters if less than 0.1 km
      : `${km.toFixed(1)} km`;
  }
};

/**
 * Format a phone number to standard format
 * @param phone Raw phone number
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if we can't format it
  return phone;
};

/**
 * Format a number with thousand separators
 * @param num Number to format
 * @param decimals Number of decimal places
 * @returns Formatted number string
 */
export const formatNumber = (num: number, decimals = 0): string => {
  if (num === null || num === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};