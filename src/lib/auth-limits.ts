export const FREE_GENERATION_LIMIT = 0;
export const FREE_DOWNLOAD_LIMIT = 2;
/** Max credit cost for a single anonymous generation (generation always requires login). */
export const ANONYMOUS_MAX_CREDIT_COST = 0;

export const ANONYMOUS_LOGIN_REQUIRED_MESSAGE =
  "Log in to generate. New accounts get free welcome credits.";

export interface AuthUser {
  email: string;
}

export interface UsageCounts {
  generations: number;
  downloads: number;
}

export interface SessionPayload {
  user: AuthUser | null;
  usage: UsageCounts;
}

export function requiresLoginForGeneration(
  user: AuthUser | null,
  _usage?: UsageCounts,
) {
  return !user;
}

export function requiresLoginForAnonymousGeneration(
  user: AuthUser | null,
  _usage?: UsageCounts,
  _creditCost?: number,
) {
  return !user;
}

export function requiresLoginForDownload(
  user: AuthUser | null,
  usage: UsageCounts,
) {
  return !user && usage.downloads >= FREE_DOWNLOAD_LIMIT;
}
