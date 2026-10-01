const db = require("./db");

const internships = [
    {
        id: "INT-101",
        company: "Infosys",
        role: "Software Engineering Intern",
        location: "Bengaluru",
        mode: "Hybrid",
        duration: "6 months",
        stipend: "₹25,000/month",
        skills: "JavaScript, Python, SQL",
        description: "Work with software development teams on real-world applications.",
        apply_link: "https://www.infosys.com/careers/"
    },
    {
        id: "INT-102",
        company: "TCS",
        role: "Graduate Engineer Intern",
        location: "Mumbai",
        mode: "On-site",
        duration: "6 months",
        stipend: "₹20,000/month",
        skills: "Java, SQL, Data Structures",
        description: "Assist engineering teams with application development and testing.",
        apply_link: "https://www.tcs.com/careers"
    },
    {
        id: "INT-103",
        company: "Wipro",
        role: "AI/ML Intern",
        location: "Bengaluru",
        mode: "Hybrid",
        duration: "3 months",
        stipend: "₹18,000/month",
        skills: "Python, Machine Learning, Pandas",
        description: "Support machine learning projects and data analysis tasks.",
        apply_link: "https://careers.wipro.com/"
    },
    {
        id: "INT-104",
        company: "Accenture",
        role: "Data Analytics Intern",
        location: "Pune",
        mode: "Hybrid",
        duration: "4 months",
        stipend: "₹22,000/month",
        skills: "Python, SQL, Power BI",
        description: "Work with data teams to create reports and business insights.",
        apply_link: "https://www.accenture.com/in-en/careers"
    },
    {
        id: "INT-105",
        company: "Microsoft",
        role: "Software Development Intern",
        location: "Hyderabad",
        mode: "On-site",
        duration: "6 months",
        stipend: "₹30,000/month",
        skills: "C++, Python, Data Structures",
        description: "Contribute to software development projects under experienced engineers.",
        apply_link: "https://careers.microsoft.com/"
    }
];

const insert = db.prepare(`
    INSERT OR IGNORE INTO internships
    (id, company, role, location, mode, duration, stipend, skills, description, apply_link)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const seed = db.transaction(() => {
    for (const internship of internships) {
        insert.run(
            internship.id,
            internship.company,
            internship.role,
            internship.location,
            internship.mode,
            internship.duration,
            internship.stipend,
            internship.skills,
            internship.description,
            internship.apply_link
        );
    }
});

seed();

console.log("Internship seed data inserted successfully.");