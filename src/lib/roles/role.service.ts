import { Prisma } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";

export const createRoleSchema = z.object({
  name: z.string().trim().min(1, "Role name is required").max(100),
  description: z.string().trim().max(500).default(""),
  isSystem: z.boolean().optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().trim().min(1, "Role name is required").max(100).optional(),
  description: z.string().trim().max(500).optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

const publicRoleSelect = {
  id: true,
  name: true,
  description: true,
  isSystem: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RoleSelect;

export async function createRole(input: CreateRoleInput) {
  const data = createRoleSchema.parse(input);
  if (data.name.toLowerCase() === "owner") {
    throw new Error("The Owner role is protected and cannot be created.");
  }
 
 try {
    return await db.role.create({
      data: {
        name: data.name,
        description: data.description,
        isSystem: data.isSystem ?? false,
      },
      select: publicRoleSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("A role with this name already exists.");
    }

    throw error;
  }
}

export async function getRoleById(id: string) {
  return db.role.findUnique({
    where: { id },
    select: publicRoleSelect,
  });
}

export async function getRoleByName(name: string) {
  return db.role.findUnique({
    where: {
      name: name.trim(),
    },
    select: publicRoleSelect,
  });
}

export async function updateRole(id: string, input: UpdateRoleInput) {
  const data = updateRoleSchema.parse(input);

  const existingRole = await db.role.findUnique({
    where: { id },
    select: {
      id: true,
      isSystem: true,
    },
  });

  if (!existingRole) {
    throw new Error("Role not found.");
  }

  if (existingRole.isSystem) {
    throw new Error("System roles cannot be modified.");
  }

  try {
    return await db.role.update({
      where: { id },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
      },
      select: publicRoleSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("A role with this name already exists.");
    }

    throw error;
  }
}
