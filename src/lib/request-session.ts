import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getSessionPayload } from "@/lib/auth-service";
import { SESSION_COOKIE } from "@/lib/session-cookie";

export async function getRequestSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const { payload, session, created } = await getSessionPayload(token);
  return { payload, session, token, created };
}

export async function getRequestSessionFromReq(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const { payload, session, created } = await getSessionPayload(token);
  return { payload, session, token, created };
}
