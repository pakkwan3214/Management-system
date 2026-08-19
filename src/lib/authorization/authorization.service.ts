import { db } from "@/lib/db";

export type AuthorizationContext = {
  userId?: string | null;
};

export type AuthorizationResult = {
  allowed: boolean;
  reason:
    | "AUTHENTICATION_REQUIRED"
    | "USER_NOT_FOUND"
    | "USER_INACTIVE"
    | "PERMISSION_REQUIRED"
    | "AUTHORIZED";
  userId?: string;
  roleNames?: string[];
  permissionKeys?: string[];
};

export async function authorize(
  context: AuthorizationContext,
  requiredPermission: string,
): Promise<AuthorizationResult> {
  const userId = context.userId?.trim();

  if (!userId) {
    return {
      allowed: false,
      reason: "AUTHENTICATION_REQUIRED",
    };
  }

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return {
      allowed: false,
      reason: "USER_NOT_FOUND",
    };
  }

  if (!user.isActive) {
    return {
      allowed: false,
      reason: "USER_INACTIVE",
      userId: user.id,
    };
  }

  const roleNames = user.roles.map((userRole) => userRole.role.name);

  const permissionKeys = [
    ...new Set(
      user.roles.flatMap((userRole) =>
        userRole.role.permissions.map(
          (rolePermission) => rolePermission.permission.key,
        ),
      ),
    ),
  ];

  if (!permissionKeys.includes(requiredPermission)) {
    return {
      allowed: false,
      reason: "PERMISSION_REQUIRED",
      userId: user.id,
      roleNames,
      permissionKeys,
    };
  }

  return {
    allowed: true,
    reason: "AUTHORIZED",
    userId: user.id,
    roleNames,
    permissionKeys,
  };
}

export async function hasPermission(
  userId: string | null | undefined,
  permissionKey: string,
): Promise<boolean> {
  const result = await authorize(
    {
      userId,
    },
    permissionKey,
  );

  return result.allowed;
}

export async function requirePermission(
  userId: string | null | undefined,
  permissionKey: string,
): Promise<void> {
  const result = await authorize(
    {
      userId,
    },
    permissionKey,
  );

  if (!result.allowed) {
    if (result.reason === "AUTHENTICATION_REQUIRED") {
      throw new Error("Authentication is required.");
    }

    if (result.reason === "USER_NOT_FOUND") {
      throw new Error("User not found.");
    }

    if (result.reason === "USER_INACTIVE") {
      throw new Error("User is inactive.");
    }

    throw new Error(
      `Permission denied. Required permission: ${permissionKey}`,
    );
  }
}
