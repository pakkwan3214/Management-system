import { describe, expect, it } from "vitest";

import { db } from "@/lib/db";
import {
  assignRole,
  getActiveUserRoles,
  getUserRoles,
  removeRole,
} from "@/lib/user-roles/user-role.service";

async function createTestUser(suffix: string) {
  return db.user.create({
    data: {
      firstName: "Test",
      lastName: "User",
      email: `user-role-${suffix}-${Date.now()}@test.local`,
      isActive: true,
    },
  });
}

async function createTestRole(suffix: string) {
  return db.role.create({
    data: {
      name: `Test Role ${suffix} ${Date.now()}`,
      description: "Role used by automated tests.",
      isSystem: false,
    },
  });
}

describe("User role service", () => {
  it("assigns one role to a user", async () => {
    const user = await createTestUser("one");
    const role = await createTestRole("one");

    await assignRole(user.id, role.id);

    const roles = await getUserRoles(user.id);

    expect(roles).toHaveLength(1);
    expect(roles[0]?.id).toBe(role.id);
  });

  it("assigns two roles to the same user", async () => {
    const user = await createTestUser("two");
    const roleOne = await createTestRole("two-a");
    const roleTwo = await createTestRole("two-b");

    await assignRole(user.id, roleOne.id);
    await assignRole(user.id, roleTwo.id);

    const roles = await getUserRoles(user.id);

    expect(roles).toHaveLength(2);
    expect(roles.map((role) => role.id)).toEqual(
      expect.arrayContaining([roleOne.id, roleTwo.id]),
    );
  });

  it("supports multiple roles", async () => {
    const user = await createTestUser("multiple");

    const rolesToAssign = await Promise.all([
      createTestRole("multiple-a"),
      createTestRole("multiple-b"),
      createTestRole("multiple-c"),
    ]);

    for (const role of rolesToAssign) {
      await assignRole(user.id, role.id);
    }

    const roles = await getUserRoles(user.id);

    expect(roles).toHaveLength(3);
  });

  it("prevents duplicate role assignments", async () => {
    const user = await createTestUser("duplicate");
    const role = await createTestRole("duplicate");

    await assignRole(user.id, role.id);

    await expect(
      assignRole(user.id, role.id),
    ).rejects.toThrow(
      "This role is already assigned to the user.",
    );
  });

  it("removes a role from a user", async () => {
    const user = await createTestUser("remove");
    const roleOne = await createTestRole("remove-a");
    const roleTwo = await createTestRole("remove-b");

    await assignRole(user.id, roleOne.id);
    await assignRole(user.id, roleTwo.id);

    await removeRole(user.id, roleOne.id);

    const roles = await getUserRoles(user.id);

    expect(roles).toHaveLength(1);
    expect(roles[0]?.id).toBe(roleTwo.id);
  });

  it("returns active roles only for an active user", async () => {
    const user = await createTestUser("active");
    const role = await createTestRole("active");

    await assignRole(user.id, role.id);

    const roles = await getActiveUserRoles(user.id);

    expect(roles).toHaveLength(1);
    expect(roles[0]?.id).toBe(role.id);
  });

  it("does not return roles as active for an inactive user", async () => {
    const user = await createTestUser("inactive");
    const role = await createTestRole("inactive");

    await assignRole(user.id, role.id);

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        isActive: false,
      },
    });

    const roles = await getActiveUserRoles(user.id);

    expect(roles).toHaveLength(0);
  });
});
