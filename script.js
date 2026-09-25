// ==========================================
// Internship Board
// ==========================================

const internshipData = [
    {
        id: "INT-101",
        title: "Frontend Intern",
        domain: "Full Stack Development",
        mode: "Remote",
        location: "India",
        skills: ["HTML", "CSS", "JavaScript"],
        openings: 3
    },
    {
        id: "INT-102",
        title: "API Engineering Intern",
        domain: "Full Stack Development",
        mode: "Hybrid",
        location: "Pune",
        skills: ["Node.js", "SQL", "Testing"],
        openings: 2
    },
    {
        id: "INT-103",
        title: "UI/UX Intern",
        domain: "UI/UX",
        mode: "Remote",
        location: "India",
        skills: ["Figma", "Research", "Accessibility"],
        openings: 1
    },
    {
        id: "INT-104",
        title: "Data Analyst Intern",
        domain: "Data Analytics",
        mode: "On-site",
        location: "Bengaluru",
        skills: ["Excel", "SQL", "Data visualisation"],
        openings: 2
    },
    {
        id: "INT-105",
        title: "Security Operations Intern",
        domain: "Cyber Security",
        mode: "Remote",
        location: "India",
        skills: ["Linux", "Logs", "Networking"],
        openings: 1
    }
];


// ==========================================
// Main page elements
// ==========================================

const searchInput =
    document.getElementById("search-input");

const domainFilter =
    document.getElementById("domain-filter");

const workModeFilter =
    document.getElementById("work-mode-filter");

const clearFiltersButton =
    document.getElementById("clear-filters");

const filterForm =
    document.getElementById("filter-form");

const internshipList =
    document.getElementById("internship-list");

const resultsCount =
    document.getElementById("results-count");

const loadingState =
    document.getElementById("loading-state");

const emptyState =
    document.getElementById("empty-state");

const errorState =
    document.getElementById("error-state");

const retryButton =
    document.getElementById("retry-button");


// ==========================================
// Details modal
// ==========================================

const detailsModal =
    document.getElementById("details-modal");

const closeModal =
    document.getElementById("close-modal");

const modalTitle =
    document.getElementById("modal-title");

const modalDomain =
    document.getElementById("modal-domain");

const modalDescription =
    document.getElementById("modal-description");

const modalMode =
    document.getElementById("modal-mode");

const modalLocation =
    document.getElementById("modal-location");

const modalOpenings =
    document.getElementById("modal-openings");

const modalSkills =
    document.getElementById("modal-skills");

const applyButton =
    document.getElementById("apply-button");


// ==========================================
// Application modal
// ==========================================

const applicationModal =
    document.getElementById("application-modal");

const closeApplication =
    document.getElementById("close-application");

const applicationInternship =
    document.getElementById(
        "application-internship"
    );

const applicationForm =
    document.getElementById(
        "application-form"
    );


// Store currently selected internship
let selectedInternship = null;


// ==========================================
// Populate filters
// ==========================================

function populateFilters() {

    const domains = [
        ...new Set(
            internshipData.map(
                internship => internship.domain
            )
        )
    ].sort();

    const modes = [
        ...new Set(
            internshipData.map(
                internship => internship.mode
            )
        )
    ].sort();


    domains.forEach(domain => {

        const option =
            document.createElement("option");

        option.value = domain;
        option.textContent = domain;

        domainFilter.appendChild(option);
    });


    modes.forEach(mode => {

        const option =
            document.createElement("option");

        option.value = mode;
        option.textContent = mode;

        workModeFilter.appendChild(option);
    });
}


// ==========================================
// Create internship card
// ==========================================

function createInternshipCard(internship) {

    const card =
        document.createElement("article");

    card.className = "internship-card";


    card.innerHTML = `
        <div class="card-top">
            <div>

                <p class="company">
                    ${internship.domain}
                </p>

                <h3>
                    ${internship.title}
                </h3>

            </div>
        </div>


        <p class="card-description">
            Explore this ${internship.title}
            opportunity and build practical
            experience in ${internship.domain}.
        </p>


        <div class="card-tags">
            ${internship.skills
                .map(
                    skill =>
                        `<span class="tag">${skill}</span>`
                )
                .join("")}
        </div>


        <div class="card-details">

            <div class="detail">
                <span class="detail-label">
                    Work mode
                </span>

                <span class="detail-value">
                    ${internship.mode}
                </span>
            </div>


            <div class="detail">
                <span class="detail-label">
                    Location
                </span>

                <span class="detail-value">
                    ${internship.location}
                </span>
            </div>


            <div class="detail">
                <span class="detail-label">
                    Openings
                </span>

                <span class="detail-value">
                    ${internship.openings}
                </span>
            </div>

        </div>


        <a
            href="#"
            class="apply-button"
            data-internship="${internship.id}"
        >
            View Internship
        </a>
    `;


    return card;
}


// ==========================================
// Render internships
// ==========================================

function renderInternships(internships) {

    internshipList.innerHTML = "";


    resultsCount.textContent =
        `${internships.length} ${
            internships.length === 1
                ? "internship"
                : "internships"
        } found`;


    if (internships.length === 0) {

        emptyState.hidden = false;

        return;
    }


    emptyState.hidden = true;


    internships.forEach(internship => {

        internshipList.appendChild(
            createInternshipCard(internship)
        );

    });
}


// ==========================================
// Filtering
// ==========================================

function filterInternships() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedDomain =
        domainFilter.value;

    const selectedMode =
        workModeFilter.value;


    const filtered =
        internshipData.filter(internship => {

            const searchableText = [
                internship.title,
                internship.domain,
                internship.location,
                internship.mode,
                ...internship.skills
            ]
                .join(" ")
                .toLowerCase();


            const matchesSearch =
                searchTerm === "" ||
                searchableText.includes(
                    searchTerm
                );


            const matchesDomain =
                selectedDomain === "all" ||
                internship.domain ===
                    selectedDomain;


            const matchesMode =
                selectedMode === "all" ||
                internship.mode ===
                    selectedMode;


            return (
                matchesSearch &&
                matchesDomain &&
                matchesMode
            );
        });


    renderInternships(filtered);
}


// ==========================================
// Clear filters
// ==========================================

function clearFilters() {

    searchInput.value = "";

    domainFilter.value = "all";

    workModeFilter.value = "all";

    filterInternships();

    searchInput.focus();
}


// ==========================================
// Open internship details
// ==========================================

function openInternshipDetails(internship) {

    selectedInternship = internship;


    modalTitle.textContent =
        internship.title;

    modalDomain.textContent =
        internship.domain;

    modalDescription.textContent =
        `This ${internship.title} opportunity
        is designed to help you gain practical
        experience in ${internship.domain}.`;

    modalMode.textContent =
        internship.mode;

    modalLocation.textContent =
        internship.location;

    modalOpenings.textContent =
        internship.openings;


    modalSkills.innerHTML =
        internship.skills
            .map(
                skill =>
                    `<span class="modal-skill">${skill}</span>`
            )
            .join("");


    detailsModal.hidden = false;

    detailsModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow = "hidden";

    closeModal.focus();
}


// ==========================================
// Close internship details
// ==========================================

function closeDetailsModal() {

    detailsModal.hidden = true;

    detailsModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


// ==========================================
// Open application form
// ==========================================

function openApplicationForm() {

    if (!selectedInternship) {
        return;
    }


    applicationInternship.textContent =
        `You are applying for ${selectedInternship.title}
        in ${selectedInternship.domain}.`;


    detailsModal.hidden = true;

    detailsModal.setAttribute(
        "aria-hidden",
        "true"
    );


    applicationModal.hidden = false;

    applicationModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    document.getElementById(
        "applicant-name"
    ).focus();
}


// ==========================================
// Close application form
// ==========================================

function closeApplicationForm() {

    applicationModal.hidden = true;

    applicationModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


// ==========================================
// Submit application
// ==========================================

applicationForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const applicantName =
            document.getElementById(
                "applicant-name"
            ).value;


        applicationForm.innerHTML = `
            <div class="state-message">

                <h3>
                    Application submitted successfully!
                </h3>

                <p>
                    Thank you, ${applicantName}.
                    Your application for
                    ${selectedInternship.title}
                    has been received.
                </p>

                <button
                    type="button"
                    id="application-done"
                    class="modal-apply"
                >
                    Done
                </button>

            </div>
        `;


        document
            .getElementById("application-done")
            .addEventListener(
                "click",
                closeApplicationForm
            );
    }
);


// ==========================================
// Event listeners
// ==========================================

searchInput.addEventListener(
    "input",
    filterInternships
);


domainFilter.addEventListener(
    "change",
    filterInternships
);


workModeFilter.addEventListener(
    "change",
    filterInternships
);


clearFiltersButton.addEventListener(
    "click",
    clearFilters
);


filterForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        filterInternships();
    }
);


// View internship
internshipList.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-internship]"
            );


        if (!button) {
            return;
        }


        event.preventDefault();


        const internship =
            internshipData.find(
                item =>
                    item.id ===
                    button.dataset.internship
            );


        if (internship) {
            openInternshipDetails(
                internship
            );
        }
    }
);


// Details modal buttons
closeModal.addEventListener(
    "click",
    closeDetailsModal
);


applyButton.addEventListener(
    "click",
    openApplicationForm
);


// Application modal
closeApplication.addEventListener(
    "click",
    closeApplicationForm
);


// Close when clicking outside modal
detailsModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            detailsModal
        ) {
            closeDetailsModal();
        }
    }
);


applicationModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            applicationModal
        ) {
            closeApplicationForm();
        }
    }
);


// Escape key
document.addEventListener(
    "keydown",
    function(event) {

        if (event.key !== "Escape") {
            return;
        }


        if (!detailsModal.hidden) {
            closeDetailsModal();
        }


        if (!applicationModal.hidden) {
            closeApplicationForm();
        }
    }
);


// ==========================================
// Initialize
// ==========================================

function initializeBoard() {

    loadingState.hidden = false;

    errorState.hidden = true;

    emptyState.hidden = true;


    setTimeout(() => {

        try {

            populateFilters();

            renderInternships(
                internshipData
            );

            loadingState.hidden = true;

        } catch (error) {

            console.error(error);

            loadingState.hidden = true;

            errorState.hidden = false;
        }

    }, 400);
}


retryButton.addEventListener(
    "click",
    initializeBoard
);


initializeBoard();