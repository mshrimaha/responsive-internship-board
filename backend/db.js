const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "data", "internships.db");

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS internships (
        id TEXT PRIMARY KEY,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        location TEXT NOT NULL,
        mode TEXT NOT NULL,
        duration TEXT,
        stipend TEXT,
        skills TEXT,
        description TEXT,
        apply_link TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;