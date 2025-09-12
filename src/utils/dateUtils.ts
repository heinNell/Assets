// src/utils/dateUtils.ts
import { format, formatDistance, parseISO } from 'date-fns';

/**
 * Format date to 'MMM dd, yyyy' (e.g., Jan 01, 2025)
 * @param date Date object or ISO string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

/**
 * Format date and time to 'MMM dd, yyyy HH:mm' (e.g., Jan 01, 2025 13:45)
 * @param date Date object or ISO string
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

/**
 * Get relative time (e.g., '5 minutes ago', 'in 3 days')
 * @param date Date object or ISO string
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

/**
 * Parse Firebase timestamp or date string to Date object
 * @param timestamp Firebase timestamp or date string
 * @returns Date object
 */
export const parseTimestamp = (timestamp: any): Date | null => {
  if (!timestamp) return null;
  
  // Handle Firebase Timestamp
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // Handle ISO strings
  if (typeof timestamp === 'string') {
    return parseISO(timestamp);
  }
  
  // Already a Date
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  return null;
};

/**
 * Format date range (e.g., "Jan 1 - Jan 15, 2025")
 * @param startDate Start date
 * @param endDate End date
 * @returns Formatted date range
 */
export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  if (!startDate || !endDate) return '';
  
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  // Same year
  if (format(start, 'yyyy') === format(end, 'yyyy')) {
    // Same month
    if (format(start, 'MMM') === format(end, 'MMM')) {
      return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
    }
    // Different month, same year
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  }
  
  // Different years
  return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
};