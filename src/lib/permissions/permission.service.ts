import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

export async function getPermissionById(id: string) {
  return db.permission.findUnique({
    where: { id },
  });
}

export async function getPermissionByKey(key: string) {
  return db.permission.findUnique({
    where: {
      key: key.trim(),
    },
  });
}

export async function getPermissions() {
  return db.permission.findMany({
    orderBy: [
      {
        group: "asc",
      },
      {
        key: "asc",
      },
    ],
  });
}

export async function assignPermission(
  roleId: string,
  permissionId: string,
) {
  try {
    return await db.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
      include: {
        permission: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("This permission is already assigned to the role.");
    }

    throw error;
  }
}

export async function removePermission(
  roleId: string,
  permissionId: string,
) {
  return db.rolePermission.delete({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId,
      },
    },
  });
}

export async function getRolePermissions(roleId: string) {
  const assignments = await db.rolePermission.findMany({
    where: {
      roleId,
    },
    include: {
      permission: true,
    },
    orderBy: {
      permission: {
        key: "asc",
      },
    },
  });

  return assignments.map((assignment) => assignment.permission);
}
