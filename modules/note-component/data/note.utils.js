export const daysFromNowToTimestamp = (days) => {
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + days); // Add days
  return futureDate.toISOString(); // Format as YYYY-MM-DD
};

export const timestampToDaysFromNow = (isoString) => {
  const now = new Date();
  const future = new Date(isoString);
  const timeDiff = future.valueOf() - now.valueOf(); // Difference in milliseconds
  return Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 0); // Convert to days
};

export const isPastCurrentTimestamp = (isoString) => {
  const inputDate = new Date(isoString);
  const now = new Date();

  return inputDate < now;
};

export const percentTimeLeft = (startDays, expirationDate) => {
  const expiration = new Date(expirationDate);
  const now = new Date();

  const startDate = new Date(expiration);
  startDate.setDate(expiration.getDate() - startDays); // Timer started days before the expiration

  const totalTime = expiration.valueOf() - startDate.valueOf(); // Total time in milliseconds
  const timeLeft = expiration.valueOf() - now.valueOf(); // Time left in milliseconds

  return Math.max(timeLeft / totalTime, 0); // Calculate percentage and ensure it's not negative
};
