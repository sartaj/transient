/**
 * Convert a number of days from now to a timestamp
 */
export declare const daysFromNowToTimestamp: (daysFromNow: number) => string;

/**
 * Convert a timestamp to a number of days from now
 */
export declare const timestampToDaysFromNow: (timestamp: string) => number;

/**
 * Check if a timestamp is in the past
 */
export declare const isPastCurrentTimestamp: (timestamp: string) => boolean;
