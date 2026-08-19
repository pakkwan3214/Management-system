import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const systemRoles = [
  {
    name: "Owner",
    description: "The single protected dealership owner role.",
  },
  {
    name: "Manager",
    description:
      "System manager role for dealership management responsibilities.",
  },
  {
    name: "Editor",
    description:
      "Reusable system role for users permitted to edit shared dealership information. Actual capabilities are determined through permissions.",
  },
  {
    name: "Salesperson",
    description: "System role for dealership sales responsibilities.",
  },
  {
    name: "Finance Manager",
    description: "System role for dealership finance responsibilities.",
  },
];

const permissions = [
  // Inventory
  {
    key: "inventory.view",
    description: "View inventory.",
    group: "Inventory",
  },
  {
    key: "inventory.create",
    description: "Create inventory records.",
    group: "Inventory",
  },
  {
    key: "inventory.edit",
    description: "Edit inventory records.",
    group: "Inventory",
  },
  {
    key: "inventory.delete",
    description: "Delete inventory records.",
    group: "Inventory",
  },
  {
    key: "inventory.change_status",
    description: "Change inventory status.",
    group: "Inventory",
  },
  {
    key: "inventory.upload_photos",
    description: "Upload inventory photos.",
    group: "Inventory",
  },
  {
    key: "inventory.upload_documents",
    description: "Upload inventory documents.",
    group: "Inventory",
  },

  // CRM
  {
    key: "crm.view",
    description: "View CRM records.",
    group: "CRM",
  },
  {
    key: "crm.create",
    description: "Create CRM records.",
    group: "CRM",
  },
  {
    key: "crm.edit",
    description: "Edit CRM records.",
    group: "CRM",
  },
  {
    key: "crm.delete",
    description: "Delete CRM records.",
    group: "CRM",
  },

  // Deals
  {
    key: "deals.view",
    description: "View deals.",
    group: "Deals",
  },
  {
    key: "deals.create",
    description: "Create deals.",
    group: "Deals",
  },
  {
    key: "deals.edit",
    description: "Edit deals.",
    group: "Deals",
  },

  // Users
  {
    key: "users.view",
    description: "View users.",
    group: "Users",
  },
  {
    key: "users.create",
    description: "Create users.",
    group: "Users",
  },
  {
    key: "users.edit",
    description: "Edit users.",
    group: "Users",
  },

  // Badges
  {
    key: "badges.view",
    description: "View badges.",
    group: "Badges",
  },
  {
    key: "badges.award",
    description: "Award badges.",
    group: "Badges",
  },

  // Reports
  {
    key: "reports.view",
    description: "View reports.",
    group: "Reports",
  },

  // Settings
  {
    key: "settings.manage",
    description: "Manage system settings.",
    group: "Settings",
  },
];

async function main() {
  for (const role of systemRoles) {
    await db.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        description: role.description,
        isSystem: true,
      },
      create: {
        name: role.name,
        description: role.description,
        isSystem: true,
      },
    });
  }

  for (const permission of permissions) {
    await db.permission.upsert({
      where: {
        key: permission.key,
      },
      update: {
        description: permission.description,
        group: permission.group,
      },
      create: {
        key: permission.key,
        description: permission.description,
        group: permission.group,
      },
    });
  }

  console.log("System roles and permissions seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

