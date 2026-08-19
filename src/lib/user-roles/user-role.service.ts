import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

const OWNER_ROLE_NAME = "Owner";

function isOwnerRole(role: { name: string }) {
  return role.name === OWNER_ROLE_NAME;
}

export async function assignRole(userId: string, roleId: string) {
  const role = await db.role.findUnique({
    where: {
      id: roleId,
    },
    select: {
      id: true,
      name: true,
      isSystem: true,
    },
  });

  if (!role) {
    throw new Error("Role not found.");
  }

  if (isOwnerRole(role)) {
    throw new Error("The Owner role cannot be assigned through this operation.");
  }

  try {
    return await db.userRole.create({
      data: {
        userId,
        roleId,
      },
      include: {
        role: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("This role is already assigned to the user.");
    }

    throw error;
  }
}

export async function assignOwnerRole(
  userId: string,
  requestingUserId: string,
) {
  if (userId !== requestingUserId) {
    throw new Error("Owner assignment is restricted.");
  }

  throw new Error("Owner assignment is restricted.");
}

export async function removeRole(userId: string, roleId: string) {
  const role = await db.role.findUnique({
    where: {
      id: roleId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!role) {
    throw new Error("Role not found.");
  }

  if (isOwnerRole(role)) {
    throw new Error("The Owner role cannot be removed through this operation.");
  }

  return db.userRole.delete({
    where: {
      userId_roleId: {
        userId,
        roleId,
      },
    },
  });
}

export async function getUserRoles(userId: string) {
  const assignments = await db.userRole.findMany({
    where: {
      userId,
    },
    include: {
      role: true,
    },
    orderBy: {
      role: {
        name: "asc",
      },
    },
  });

  return assignments.map((assignment) => assignment.role);
}

export async function getActiveUserRoles(userId: string) {
  const assignments = await db.userRole.findMany({
    where: {
      userId,
      user: {
        isActive: true,
      },
    },
    include: {
      role: true,
    },
    orderBy: {
      role: {
        name: "asc",
      },
    },
  });

  return assignments.map((assignment) => assignment.role);
}

