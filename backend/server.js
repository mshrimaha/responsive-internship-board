const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());


// =====================================================
// HOME / HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
    res.json({
        message: "Internship API is running"
    });
});


// =====================================================
// GET ALL INTERNSHIPS
// Supports:
// ?search=Python
// ?location=Bengaluru
// ?mode=Hybrid
// ?company=Infosys
// ?page=1&limit=10
// =====================================================

app.get("/api/internships", (req, res) => {
    try {
        const {
            search = "",
            location,
            mode,
            company,
            page = 1,
            limit = 10
        } = req.query;

        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const limitNumber = Math.min(
            Math.max(parseInt(limit) || 10, 1),
            100
        );

        const offset = (pageNumber - 1) * limitNumber;

        let conditions = [];
        let params = [];

        // Search company, role, skills and description
        if (search.trim()) {
            conditions.push(`
                (
                    company LIKE ?
                    OR role LIKE ?
                    OR skills LIKE ?
                    OR description LIKE ?
                )
            `);

            const searchValue = `%${search.trim()}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );
        }

        // Location filter
        if (location) {
            conditions.push("location LIKE ?");
            params.push(`%${location}%`);
        }

        // Mode filter
        if (mode) {
            conditions.push("mode = ?");
            params.push(mode);
        }

        // Company filter
        if (company) {
            conditions.push("company LIKE ?");
            params.push(`%${company}%`);
        }

        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

        // Count total matching internships
        const totalResult = db
            .prepare(`
                SELECT COUNT(*) AS total
                FROM internships
                ${whereClause}
            `)
            .get(...params);

        const total = totalResult.total;

        // Get paginated internships
        const internships = db
            .prepare(`
                SELECT *
                FROM internships
                ${whereClause}
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `)
            .all(...params, limitNumber, offset);

        res.json({
            success: true,

            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total: total,
                totalPages: Math.ceil(total / limitNumber)
            },

            count: internships.length,

            data: internships
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch internships"
        });
    }
});


// =====================================================
// GET INTERNSHIP BY ID
// =====================================================

app.get("/api/internships/:id", (req, res) => {
    try {
        const internship = db
            .prepare(`
                SELECT *
                FROM internships
                WHERE id = ?
            `)
            .get(req.params.id);

        if (!internship) {
            return res.status(404).json({
                success: false,
                error: "Internship not found"
            });
        }

        res.json({
            success: true,
            data: internship
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch internship"
        });
    }
});


// =====================================================
// CREATE NEW INTERNSHIP
// =====================================================

app.post("/api/internships", (req, res) => {
    try {
        const {
            id,
            company,
            role,
            location,
            mode,
            duration,
            stipend,
            skills,
            description,
            apply_link
        } = req.body;

        // Required field validation
        if (!id || !company || !role || !location || !mode) {
            return res.status(400).json({
                success: false,
                error: "id, company, role, location and mode are required"
            });
        }

        // Check duplicate ID
        const existing = db
            .prepare(`
                SELECT id
                FROM internships
                WHERE id = ?
            `)
            .get(id);

        if (existing) {
            return res.status(409).json({
                success: false,
                error: "Internship ID already exists"
            });
        }

        // Insert internship
        db.prepare(`
            INSERT INTO internships
            (
                id,
                company,
                role,
                location,
                mode,
                duration,
                stipend,
                skills,
                description,
                apply_link
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id,
            company,
            role,
            location,
            mode,
            duration || null,
            stipend || null,
            skills || null,
            description || null,
            apply_link || null
        );

        // Get newly created internship
        const internship = db
            .prepare(`
                SELECT *
                FROM internships
                WHERE id = ?
            `)
            .get(id);

        res.status(201).json({
            success: true,
            message: "Internship created successfully",
            data: internship
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to create internship"
        });
    }
});


// =====================================================
// UPDATE INTERNSHIP
// =====================================================

app.put("/api/internships/:id", (req, res) => {
    try {
        const existing = db
            .prepare(`
                SELECT *
                FROM internships
                WHERE id = ?
            `)
            .get(req.params.id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: "Internship not found"
            });
        }

        const {
            company = existing.company,
            role = existing.role,
            location = existing.location,
            mode = existing.mode,
            duration = existing.duration,
            stipend = existing.stipend,
            skills = existing.skills,
            description = existing.description,
            apply_link = existing.apply_link
        } = req.body;

        db.prepare(`
            UPDATE internships
            SET
                company = ?,
                role = ?,
                location = ?,
                mode = ?,
                duration = ?,
                stipend = ?,
                skills = ?,
                description = ?,
                apply_link = ?
            WHERE id = ?
        `).run(
            company,
            role,
            location,
            mode,
            duration,
            stipend,
            skills,
            description,
            apply_link,
            req.params.id
        );

        const updated = db
            .prepare(`
                SELECT *
                FROM internships
                WHERE id = ?
            `)
            .get(req.params.id);

        res.json({
            success: true,
            message: "Internship updated successfully",
            data: updated
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to update internship"
        });
    }
});


// =====================================================
// DELETE INTERNSHIP
// =====================================================

app.delete("/api/internships/:id", (req, res) => {
    try {
        const result = db
            .prepare(`
                DELETE FROM internships
                WHERE id = ?
            `)
            .run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                error: "Internship not found"
            });
        }

        res.json({
            success: true,
            message: "Internship deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to delete internship"
        });
    }
});


// =====================================================
// START SERVER
// =====================================================

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Internship API running on http://localhost:${PORT}`);
    });
}

module.exports = app;