import crypto from "crypto";

export function generateCacheKey(
  prefix: string,
  params: Record<string, any>
): string {
  const normalized = JSON.stringify(sortObject(params));
  const hash = crypto
    .createHash("sha1")
    .update(`${prefix}:${normalized}`)
    .digest("hex");
  // sha1 hex is 40 chars
  return hash;
}

function sortObject(obj: any): any {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sortObject);
  const sortedKeys = Object.keys(obj).sort();
  const out: Record<string, any> = {};
  for (const k of sortedKeys) out[k] = sortObject(obj[k]);
  return out;
}
