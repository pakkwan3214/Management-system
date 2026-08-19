import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";

export const createUserSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("A valid email is required").max(320),
  phone: z.string().trim().max(30).optional().nullable(),
  profileImageUrl: z.string().trim().url().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const updateUserSchema = createUserSchema
  .partial()
  .omit({
    isActive: true,
  })
  .extend({
    isActive: z.boolean().optional(),
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

const publicUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  profileImageUrl: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export async function createUser(input: CreateUserInput) {
  const data = createUserSchema.parse(input);

  try {
    return await db.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        phone: data.phone ?? null,
        profileImageUrl: data.profileImageUrl ?? null,
        isActive: data.isActive ?? true,
      },
      select: publicUserSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("A user with this email already exists.");
    }

    throw error;
  }
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: publicUserSelect,
  });
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const data = updateUserSchema.parse(input);

  try {
    return await db.user.update({
      where: { id },
      data: {
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.email !== undefined && {
          email: data.email.toLowerCase(),
        }),
        ...(data.phone !== undefined && {
          phone: data.phone ?? null,
        }),
        ...(data.profileImageUrl !== undefined && {
          profileImageUrl: data.profileImageUrl ?? null,
        }),
        ...(data.isActive !== undefined && {
          isActive: data.isActive,
        }),
      },
      select: publicUserSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("A user with this email already exists.");
    }

    throw error;
  }
}
