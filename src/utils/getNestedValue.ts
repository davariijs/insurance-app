export const getNestedValue = <T extends Record<string, unknown>>(
  obj: T,
  path: string
): unknown => {
  const value = path.split('.').reduce((acc: unknown, key) => {
    if (acc !== null && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);

  return value;
};
