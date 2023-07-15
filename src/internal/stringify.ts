type PrimitiveValue = string | number | boolean | null | undefined;

function isPrimitive(value: unknown): value is PrimitiveValue {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === undefined ||
    value === null
  );
}

export function stringify(value: unknown): string {
  return isPrimitive(value) ? String(value) : JSON.stringify(value);
}
