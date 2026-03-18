const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  throw new Error("Ambiente nao suporta geracao de UUID via crypto.randomUUID().");
}

export function generateIdempotencyKey(): string {
  return generateUuid();
}

export function validateIdempotencyKey(idempotencyKey: string): void {
  if (!UUID_V4_REGEX.test(idempotencyKey)) {
    throw new Error("IdempotencyKey invalido. Era esperado um UUID v4.");
  }
}
