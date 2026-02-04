import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // For SQLite, ensure this is a valid connection string
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});