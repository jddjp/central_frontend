export const renameKey = <
  OldKey extends keyof T,
  NewKey extends string,
  T extends Record<string, any
  >
>(
  userObject: T,
  oldKey: OldKey,
  newKey: NewKey extends keyof T ? never : NewKey,
): Record<NewKey, T[OldKey]> & Omit<T, OldKey> => {
  const { [oldKey]: value, ...common } = userObject

  return {
    ...common,
    ...({ [newKey]: value } as Record<NewKey, T[OldKey]>)
  }
}