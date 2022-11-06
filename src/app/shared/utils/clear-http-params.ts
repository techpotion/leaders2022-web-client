type PrimitiveParam = string | number | boolean;
type Param = PrimitiveParam | ReadonlyArray<PrimitiveParam>;

export function clearHttpParams(
  params: Record<string, Param>,
): Record<string, Param> {
  const newParams = { ...params };
  for (const key of Object.keys(newParams)) {
    if (newParams[key] === undefined) {
      delete newParams[key];
    }
  }

  return newParams;
}
