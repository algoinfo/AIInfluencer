export const FREE_GENERATION_LIMIT = 1;
export const FREE_DOWNLOAD_LIMIT = 2;
/** Max credit cost for a single anonymous generation */
export const ANONYMOUS_MAX_CREDIT_COST = 1;

export const ANONYMOUS_LOGIN_REQUIRED_MESSAGE =
  "Log in to continue. Free guests get one demo generation.";

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
  usage: UsageCounts,
) {
  return !user && usage.generations >= FREE_GENERATION_LIMIT;
}

export function requiresLoginForAnonymousGeneration(
  user: AuthUser | null,
  usage: UsageCounts,
  creditCost: number,
) {
  if (user) return false;
  return (
    usage.generations >= FREE_GENERATION_LIMIT ||
    creditCost > ANONYMOUS_MAX_CREDIT_COST
  );
}

export function requiresLoginForDownload(
  user: AuthUser | null,
  usage: UsageCounts,
) {
  return !user && usage.downloads >= FREE_DOWNLOAD_LIMIT;
}
