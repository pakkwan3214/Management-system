import { db } from "@/lib/db";
import {
  authorize,
  hasPermission,
  requirePermission,
} from "@/lib/authorization/authorization.service";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Authorization service", () => {
  let authorizedUserId: string;
  let multiRoleUserId: string;
  let inactiveUserId: string;
  let editorUserId: string;
  let noEditEditorUserId: string;

  let inventoryViewPermissionId: string;
  let inventoryEditPermissionId: string;
  let inventoryCreatePermissionId: string;

  let managerRoleId: string;
  let editorRoleId: string;
  let salespersonRoleId: string;

  beforeAll(async () => {
    const inventoryViewPermission = await db.permission.findUnique({
      where: {
        key: "inventory.view",
      },
    });

    const inventoryEditPermission = await db.permission.findUnique({
      where: {
        key: "inventory.edit",
      },
    });

    const inventoryCreatePermission = await db.permission.findUnique({
      where: {
        key: "inventory.create",
      },
    });

    expect(inventoryViewPermission).not.toBeNull();
    expect(inventoryEditPermission).not.toBeNull();
    expect(inventoryCreatePermission).not.toBeNull();

    inventoryViewPermissionId = inventoryViewPermission!.id;
    inventoryEditPermissionId = inventoryEditPermission!.id;
    inventoryCreatePermissionId = inventoryCreatePermission!.id;

    const managerRole = await db.role.findUnique({
      where: {
        name: "Manager",
      },
    });

    const editorRole = await db.role.findUnique({
      where: {
        name: "Editor",
      },
    });

    const salespersonRole = await db.role.findUnique({
      where: {
        name: "Salesperson",
      },
    });

    expect(managerRole).not.toBeNull();
    expect(editorRole).not.toBeNull();
    expect(salespersonRole).not.toBeNull();

    managerRoleId = managerRole!.id;
    editorRoleId = editorRole!.id;
    salespersonRoleId = salespersonRole!.id;

    await db.rolePermission.deleteMany({
      where: {
        roleId: {
          in: [managerRoleId, editorRoleId, salespersonRoleId],
        },
        permissionId: {
          in: [
            inventoryViewPermissionId,
            inventoryEditPermissionId,
            inventoryCreatePermissionId,
          ],
        },
      },
    });

    await db.rolePermission.createMany({
      data: [
        {
          roleId: managerRoleId,
          permissionId: inventoryViewPermissionId,
        },
        {
          roleId: editorRoleId,
          permissionId: inventoryEditPermissionId,
        },
        {
          roleId: salespersonRoleId,
          permissionId: inventoryCreatePermissionId,
        },
      ],
      skipDuplicates: true,
    });

    const timestamp = Date.now();

    const authorizedUser = await db.user.create({
      data: {
        firstName: "Authorization",
        lastName: "Authorized",
        email: `authorization-authorized-${timestamp}@test.local`,
        isActive: true,
      },
    });

    authorizedUserId = authorizedUser.id;

    await db.userRole.create({
      data: {
        userId: authorizedUserId,
        roleId: managerRoleId,
      },
    });

    const multiRoleUser = await db.user.create({
      data: {
        firstName: "Authorization",
        lastName: "MultiRole",
        email: `authorization-multirole-${timestamp}@test.local`,
        isActive: true,
      },
    });

    multiRoleUserId = multiRoleUser.id;

    await db.userRole.createMany({
      data: [
        {
          userId: multiRoleUserId,
          roleId: managerRoleId,
        },
        {
          userId: multiRoleUserId,
          roleId: salespersonRoleId,
        },
      ],
    });

    const inactiveUser = await db.user.create({
      data: {
        firstName: "Authorization",
        lastName: "Inactive",
        email: `authorization-inactive-${timestamp}@test.local`,
        isActive: false,
      },
    });

    inactiveUserId = inactiveUser.id;

    await db.userRole.create({
      data: {
        userId: inactiveUserId,
        roleId: managerRoleId,
      },
    });

    const editorUser = await db.user.create({
      data: {
        firstName: "Authorization",
        lastName: "Editor",
        email: `authorization-editor-${timestamp}@test.local`,
        isActive: true,
      },
    });

    editorUserId = editorUser.id;

    await db.userRole.create({
      data: {
        userId: editorUserId,
        roleId: editorRoleId,
      },
    });

    const noEditEditorUser = await db.user.create({
      data: {
        firstName: "Authorization",
        lastName: "EditorNoEdit",
        email: `authorization-editor-no-edit-${timestamp}@test.local`,
        isActive: true,
      },
    });

    noEditEditorUserId = noEditEditorUser.id;

    await db.userRole.create({
      data: {
        userId: noEditEditorUserId,
        roleId: editorRoleId,
      },
    });
  });

  afterAll(async () => {
    await db.userRole.deleteMany({
      where: {
        userId: {
          in: [
            authorizedUserId,
            multiRoleUserId,
            inactiveUserId,
            editorUserId,
            noEditEditorUserId,
          ],
        },
      },
    });

    await db.user.deleteMany({
      where: {
        id: {
          in: [
            authorizedUserId,
            multiRoleUserId,
            inactiveUserId,
            editorUserId,
            noEditEditorUserId,
          ],
        },
      },
    });

    await db.rolePermission.deleteMany({
      where: {
        roleId: {
          in: [managerRoleId, editorRoleId, salespersonRoleId],
        },
        permissionId: {
          in: [
            inventoryViewPermissionId,
            inventoryEditPermissionId,
            inventoryCreatePermissionId,
          ],
        },
      },
    });
  });

  it("allows authorized access", async () => {
    const result = await authorize(
      { userId: authorizedUserId },
      "inventory.view",
    );

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("AUTHORIZED");
    expect(result.roleNames).toContain("Manager");
    expect(result.permissionKeys).toContain("inventory.view");
  });

  it("rejects unauthorized access", async () => {
    const result = await authorize(
      { userId: authorizedUserId },
      "inventory.delete",
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("PERMISSION_REQUIRED");
  });

  it("combines permissions from multiple roles", async () => {
    const canView = await hasPermission(
      multiRoleUserId,
      "inventory.view",
    );

    const canCreate = await hasPermission(
      multiRoleUserId,
      "inventory.create",
    );

    expect(canView).toBe(true);
    expect(canCreate).toBe(true);
  });

  it("rejects inactive users", async () => {
    const result = await authorize(
      { userId: inactiveUserId },
      "inventory.view",
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("USER_INACTIVE");
  });

  it("rejects unauthenticated requests", async () => {
    const result = await authorize(
      { userId: null },
      "inventory.view",
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("AUTHENTICATION_REQUIRED");
  });

  it("allows an Editor through the normal permission architecture", async () => {
    const result = await authorize(
      { userId: editorUserId },
      "inventory.edit",
    );

    expect(result.allowed).toBe(true);
    expect(result.roleNames).toContain("Editor");
    expect(result.permissionKeys).toContain("inventory.edit");
  });

  it("rejects an Editor without the requested permission", async () => {
    const result = await authorize(
      { userId: noEditEditorUserId },
      "inventory.delete",
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("PERMISSION_REQUIRED");
  });

  it("throws when required permission is missing", async () => {
    await expect(
      requirePermission(
        authorizedUserId,
        "inventory.delete",
      ),
    ).rejects.toThrow(
      "Permission denied. Required permission: inventory.delete",
    );
  });
});
