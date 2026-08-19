import { NextResponse } from "next/server";
import { z } from "zod";
import {
  authenticateUser,
  createSession,
  getSessionCookieName,
  getSessionDurationSeconds,
} from "@/lib/auth/auth";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 400 },
    );
  }

  const user = await authenticateUser(
    parsed.data.email,
    parsed.data.password,
  );

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const token = await createSession(user.id);

  const response = NextResponse.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });

  response.cookies.set({
    name: getSessionCookieName(),
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getSessionDurationSeconds(),
  });

  return response;
}
