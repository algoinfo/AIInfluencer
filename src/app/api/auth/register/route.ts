import { NextRequest, NextResponse } from "next/server";
import { registerWithPassword } from "@/lib/auth-service";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session-cookie";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };
    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const { payload, session } = await registerWithPassword(
      token,
      email,
      password,
    );

    const res = NextResponse.json(payload);
    res.cookies.set(SESSION_COOKIE, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });
    return res;
  } catch (error) {
    console.error("[auth/register]", error);
    const message = error instanceof Error ? error.message : "Sign up failed";
    const status = message.includes("already exists") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
