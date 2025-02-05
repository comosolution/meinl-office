export const notEmptyValidation = (value: string, error: string) => {
  return value.trim().length < 1 ? error : null;
};

export const parseDateString = (dob: string) => {
  if (!dob) return null;
  const year = parseInt(dob.substring(0, 4), 10);
  const month = parseInt(dob.substring(4, 6), 10) - 1;
  const day = parseInt(dob.substring(6, 8), 10);
  return new Date(year, month, day);
};

export const formatDateToString = (date: Date | null): string => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2 digits
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}${month}${day}`;
};
