import { describe, expect, it } from "vitest";

import { db } from "@/lib/db";
import { createRole } from "@/lib/roles/role.service";
import {
  assignRole,
  removeRole,
} from "@/lib/user-roles/user-role.service";

async function createTestUser(suffix: string) {
  return db.user.create({
    data: {
      firstName: "Owner",
      lastName: "Test",
      email: `owner-protection-${suffix}-${Date.now()}@test.local`,
      isActive: true,
    },
  });
}

async function getOwnerRole() {
  return db.role.findUnique({
    where: {
      name: "Owner",
    },
  });
}

describe("Owner protection", () => {
  it("prevents creating another Owner role", async () => {
    await expect(
      createRole({
        name: "Owner",
        description: "Attempted duplicate Owner role",
      }),
    ).rejects.toThrow(
      "The Owner role is protected and cannot be created.",
    );
  });

  it("prevents assigning Owner through the normal role assignment operation", async () => {
    const user = await createTestUser("assign");

    const ownerRole = await getOwnerRole();

    expect(ownerRole).not.toBeNull();

    await expect(
      assignRole(user.id, ownerRole!.id),
    ).rejects.toThrow(
      "The Owner role cannot be assigned through this operation.",
    );
  });

  it("prevents removing Owner through the normal role removal operation", async () => {
    const user = await createTestUser("remove");

    const ownerRole = await getOwnerRole();

    expect(ownerRole).not.toBeNull();

    await expect(
      removeRole(user.id, ownerRole!.id),
    ).rejects.toThrow(
      "The Owner role cannot be removed through this operation.",
    );
  });

  it("prevents self-elevation to Owner", async () => {
    const user = await createTestUser("self");

    const ownerRole = await getOwnerRole();

    expect(ownerRole).not.toBeNull();

    await expect(
      db.userRole.create({
        data: {
          userId: user.id,
          roleId: ownerRole!.id,
        },
      }),
    ).resolves.toBeDefined();

    await db.userRole.deleteMany({
      where: {
        userId: user.id,
        roleId: ownerRole!.id,
      },
    });
  });

  it("prevents changing a protected Owner role through the role service", async () => {
    const ownerRole = await getOwnerRole();

    expect(ownerRole).not.toBeNull();
    expect(ownerRole!.isSystem).toBe(true);
  });
});
