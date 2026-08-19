import { db } from "@/lib/db";
import {
  createRole,
  getRoleById,
  getRoleByName,
  updateRole,
} from "@/lib/roles/role.service";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Role service", () => {
  beforeAll(async () => {
    await db.role.deleteMany({
      where: {
        name: {
          in: [
            "Test Custom Role",
            "Update Test Role",
            "Updated Custom Role",
            "Duplicate Test Role",
            "Test System Role",
            "Attempted System Role Change",
          ],
        },
      },
    });
  });

  afterAll(async () => {
    await db.role.deleteMany({
      where: {
        name: {
          in: [
            "Test Custom Role",
            "Update Test Role",
            "Updated Custom Role",
            "Duplicate Test Role",
            "Test System Role",
           
 "Attempted System Role Change",
          ],
        },
      },
    });
  });

  it("creates a custom role", async () => {
    const role = await createRole({
      name: "Test Custom Role",
      description: "A test custom role.",
    });

    expect(role.name).toBe("Test Custom Role");
    expect(role.description).toBe("A test custom role.");
    expect(role.isSystem).toBe(false);
    expect(role.id).toBeTruthy();
    expect(role.createdAt).toBeInstanceOf(Date);
    expect(role.updatedAt).toBeInstanceOf(Date);
  });

  it("retrieves a role by ID and name", async () => {
    const created = await createRole({
      name: "Test System Role",
      description: "System role used for testing.",
      isSystem: true,
    });

    const byId = await getRoleById(created.id);
    const byName = await getRoleByName(created.name);

    expect(byId?.id).toBe(created.id);
    expect(byName?.id).toBe(created.id);
  });

  it("updates a custom role", async () => {
    const created = await createRole({
      name: "Update Test Role",
      description: "Original description.",
    });

    const updated = await updateRole(created.id, {
      name: "Updated Custom Role",
      description: "Updated description.",
    });

    expect(updated.name).toBe("Updated Custom Role");
    expect(updated.description).toBe("Updated description.");
    expect(updated.isSystem).toBe(false);
  });

  it("rejects duplicate role names", async () => {
    await createRole({
      name: "Duplicate Test Role",
      description: "First role.",
    });

    await expect(
      createRole({
        name: "Duplicate Test Role",
        description: "Duplicate role.",
      }),
    ).rejects.toThrow("A role with this name already exists.");
  });

  it("prevents modification of system roles", async () => {
    const systemRole = await getRoleByName("Test System Role");

    expect(systemRole).not.toBeNull();

    await expect(
      updateRole(systemRole!.id, {
        name: "Attempted System Role Change",
      }),
    ).rejects.toThrow("System roles cannot be modified.");
  });
});
