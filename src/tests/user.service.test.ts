import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from "@/lib/users/user.service";

import { db } from "@/lib/db";

describe("User service", () => {
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    await db.user.deleteMany({
      where: {
        email: {
          endsWith: "@user-service-test.local",
        },
      },
    });
  });

  afterAll(async () => {
    if (createdUserIds.length > 0) {
      await db.user.deleteMany({
        where: {
          id: {
            in: createdUserIds,
          },
        },
      });
    }

    await db.$disconnect();
  });

  it("creates a user", async () => {
    const user = await createUser({
      firstName: "Test",
      lastName: "User",
      email: "create@user-service-test.local",
      phone: "416-555-0100",
    });

    createdUserIds.push(user.id);

    expect(user.id).toBeTruthy();
    expect(user.firstName).toBe("Test");
    expect(user.lastName).toBe("User");
    expect(user.email).toBe("create@user-service-test.local");
    expect(user.isActive).toBe(true);
  });

  it("retrieves a user by ID and email", async () => {
    const user = await createUser({
      firstName: "Retrieve",
      lastName: "User",
      email: "retrieve@user-service-test.local",
    });

    createdUserIds.push(user.id);

    const byId = await getUserById(user.id);
    const byEmail = await getUserByEmail(
      "RETRIEVE@USER-SERVICE-TEST.LOCAL",
    );

    expect(byId?.id).toBe(user.id);
    expect(byEmail?.id).toBe(user.id);
  });

  it("updates a user", async () => {
    const user = await createUser({
      firstName: "Before",
      lastName: "Update",
      email: "update@user-service-test.local",
    });

    createdUserIds.push(user.id);

    const updated = await updateUser(user.id, {
      firstName: "After",
      phone: "416-555-0200",
    });

    expect(updated.firstName).toBe("After");
    expect(updated.phone).toBe("416-555-0200");
    expect(updated.email).toBe("update@user-service-test.local");
  });

  it("validates invalid user data", async () => {
    await expect(
      createUser({
        firstName: "",
        lastName: "User",
        email: "invalid@user-service-test.local",
      }),
    ).rejects.toThrow();
  });

  it("rejects duplicate email addresses", async () => {
    const email = "duplicate@user-service-test.local";

    const first = await createUser({
      firstName: "First",
      lastName: "Duplicate",
      email,
    });

    createdUserIds.push(first.id);

    await expect(
      createUser({
        firstName: "Second",
        lastName: "Duplicate",
        email: email.toUpperCase(),
      }),
    ).rejects.toThrow("A user with this email already exists.");
  });

  it("supports active and inactive users", async () => {
    const user = await createUser({
      firstName: "Inactive",
      lastName: "User",
      email: "inactive@user-service-test.local",
      isActive: false,
    });

    createdUserIds.push(user.id);

    expect(user.isActive).toBe(false);

    const reactivated = await updateUser(user.id, {
      isActive: true,
    });

    expect(reactivated.isActive).toBe(true);
  });

  it("does not expose passwordHash through normal user operations", async () => {
    const user = await createUser({
      firstName: "Secure",
      lastName: "User",
      email: "secure@user-service-test.local",
    });

    createdUserIds.push(user.id);

    expect(user).not.toHaveProperty("passwordHash");
  });

  it("does not allow privileged fields through the update input", async () => {
    const user = await createUser({
      firstName: "Protected",
      lastName: "User",
      email: "protected@user-service-test.local",
    });

    createdUserIds.push(user.id);

    const maliciousInput = {
      firstName: "Updated",
      role: "ADMIN",
      permissions: ["ALL"],
      passwordHash: "should-not-be-accepted",
    } as never;

    const updated = await updateUser(user.id, maliciousInput);

    expect(updated.firstName).toBe("Updated");
    expect(updated).not.toHaveProperty("role");
    expect(updated).not.toHaveProperty("permissions");
    expect(updated).not.toHaveProperty("passwordHash");
  });
});
