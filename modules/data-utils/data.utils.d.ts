/**
 * Creates a debounced version of a function.
 * The debounced function will delay the execution of the original function
 * until after a specified amount of time has elapsed since the last time it was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @param {boolean} immediate - If `true`, the function will be invoked on the leading edge of the timeout.
 * @returns {Function} - The debounced function.
 */
export declare function debounce<T extends Function>(fn: T, delay: number): T;
