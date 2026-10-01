const request = require("supertest");
const app = require("../server");

describe("Internship API", () => {

    // ==========================================
    // GET TESTS
    // ==========================================

    test("GET /api/internships should return all internships", async () => {
        const response = await request(app)
            .get("/api/internships");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.count).toBeGreaterThanOrEqual(5);
        expect(response.body.data).toBeInstanceOf(Array);
    });


    test("GET /api/internships/INT-101 should return one internship", async () => {
        const response = await request(app)
            .get("/api/internships/INT-101");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe("INT-101");
    });


    test("GET invalid internship should return 404", async () => {
        const response = await request(app)
            .get("/api/internships/INVALID-ID");

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    // ==========================================
    // SEARCH / FILTER / PAGINATION TESTS
    // ==========================================

    test("Search should return matching internships", async () => {
        const response = await request(app)
            .get("/api/internships?search=Python");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.pagination.total).toBe(4);
    });


    test("Location filter should work", async () => {
        const response = await request(app)
            .get("/api/internships?location=Bengaluru");

        expect(response.statusCode).toBe(200);
        expect(response.body.pagination.total).toBe(2);
    });


    test("Mode filter should work", async () => {
        const response = await request(app)
            .get("/api/internships?mode=Hybrid");

        expect(response.statusCode).toBe(200);
        expect(response.body.pagination.total).toBe(3);
    });


    test("Pagination should work", async () => {
        const response = await request(app)
            .get("/api/internships?page=1&limit=2");

        expect(response.statusCode).toBe(200);
        expect(response.body.pagination.page).toBe(1);
        expect(response.body.pagination.limit).toBe(2);
        expect(response.body.pagination.total).toBe(5);
        expect(response.body.pagination.totalPages).toBe(3);
        expect(response.body.count).toBe(2);
    });


    // ==========================================
    // POST TESTS
    // ==========================================

    test("POST should create a new internship", async () => {
        const newInternship = {
            id: "TEST-001",
            company: "Test Company",
            role: "Backend Developer Intern",
            location: "Mangaluru",
            mode: "Remote",
            duration: "3 months",
            stipend: "₹15,000/month",
            skills: "Node.js, Express, SQLite",
            description: "Test internship for API testing.",
            apply_link: "https://example.com/apply"
        };

        const response = await request(app)
            .post("/api/internships")
            .send(newInternship);

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe("TEST-001");
        expect(response.body.data.company).toBe("Test Company");
    });


    test("POST should reject missing required fields", async () => {
        const response = await request(app)
            .post("/api/internships")
            .send({
                company: "Test Company"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("POST should reject duplicate internship ID", async () => {
        const response = await request(app)
            .post("/api/internships")
            .send({
                id: "INT-101",
                company: "Duplicate Company",
                role: "Test Intern",
                location: "Bengaluru",
                mode: "Remote"
            });

        expect(response.statusCode).toBe(409);
        expect(response.body.success).toBe(false);
    });


    // ==========================================
    // PUT TESTS
    // ==========================================

    test("PUT should update an existing internship", async () => {
        const response = await request(app)
            .put("/api/internships/TEST-001")
            .send({
                company: "Updated Company",
                role: "Updated Backend Intern"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.company).toBe("Updated Company");
        expect(response.body.data.role).toBe("Updated Backend Intern");
    });


    test("PUT should return 404 for non-existent internship", async () => {
        const response = await request(app)
            .put("/api/internships/DOES-NOT-EXIST")
            .send({
                company: "Test Company"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    // ==========================================
    // DELETE TESTS
    // ==========================================

    test("DELETE should delete an existing internship", async () => {
        const response = await request(app)
            .delete("/api/internships/TEST-001");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("DELETE should return 404 for non-existent internship", async () => {
        const response = await request(app)
            .delete("/api/internships/DOES-NOT-EXIST");

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });

});