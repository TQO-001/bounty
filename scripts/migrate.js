const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set")
  process.exit(1)
}

const migrationsDir = path.join(__dirname, "..", "migrations")
const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql")).sort()

console.log("Running migrations...")
for (const file of files) {
  const filepath = path.join(migrationsDir, file)
  console.log("  -> " + file)
  execSync(`psql "${DATABASE_URL}" -f "${filepath}"`, { stdio: "inherit" })
}
console.log("Done!")
