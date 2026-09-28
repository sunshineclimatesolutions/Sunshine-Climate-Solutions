// Helpers for pages that render copy from the `site` content collection
// (src/content/site/*.md). Business facts stay in src/config/business.ts.
import { business } from '../config/business';

/**
 * Narrows an optional content section to a required value at build time.
 * Throws a clear error naming the missing field so bad content fails the
 * build instead of rendering an empty section.
 */
export function need<T>(value: T | undefined, field: string): T {
  if (value === undefined) {
    throw new Error(`[content] Missing required field in src/content/site/: ${field}`);
  }
  return value;
}

/**
 * Replaces documented tokens in content copy with values from business.ts so
 * business facts stay single-sourced. Supported tokens:
 *   {serviceCall} → business.pricing.serviceCall (e.g. "$50")
 */
export function interpolateBusiness(text: string): string {
  return text.replaceAll('{serviceCall}', business.pricing.serviceCall);
}
