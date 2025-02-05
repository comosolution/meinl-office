export const notEmptyValidation = (value: string, error: string) => {
  return value.trim().length < 1 ? error : null;
};
