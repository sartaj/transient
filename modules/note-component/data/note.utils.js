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
