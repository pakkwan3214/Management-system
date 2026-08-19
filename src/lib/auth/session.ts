import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  getSessionCookieName,
  verifySession,
} from "@/lib/auth/auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    return null;
  }

  const session = await verifySession(token);

  if (!session) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      profileImageUrl: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return user;
}
