
// =====================================
// CareerAI - JavaScript
// =====================================

// MOBILE MENU
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");

    menuToggle.textContent =
        navLinks.classList.contains("active") ? "✕" : "☰";
});

// Close mobile menu after clicking a link
document.querySelectorAll(".nav-links a").forEach(function(link) {
    link.addEventListener("click", function() {
        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";
    });
});

// =====================================
// LOGIN MODAL
// =====================================

const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");

loginBtn.addEventListener("click", function() {
    loginModal.classList.add("show");
});

closeModal.addEventListener("click", function() {
    loginModal.classList.remove("show");
});

loginModal.addEventListener("click", function(event) {
    if (event.target === loginModal) {
        loginModal.classList.remove("show");
    }
});

// Demo Login
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;

    alert("Welcome to CareerAI!\nLogged in as: " + email);

    loginModal.classList.remove("show");
    this.reset();
});

// =====================================
// CAREER DATA
// =====================================

const careerData = [
    {
        name: "Web Developer",
        icon: "💻",
        description: "Create modern websites and web applications.",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        interest: "Web Development",
        related: ["HTML", "CSS", "JavaScript", "React"]
    },
    {
        name: "Data Analyst",
        icon: "📊",
        description: "Analyze data and discover useful business insights.",
        skills: ["Python", "SQL", "Excel"],
        interest: "Data Science",
        related: ["Python", "SQL", "Excel"]
    },
    {
        name: "AI Engineer",
        icon: "🤖",
        description: "Build intelligent applications using AI and machine learning.",
        skills: ["Python", "Java"],
        interest: "Artificial Intelligence",
        related: ["Python", "Java"]
    },
    {
        name: "Cyber Security Analyst",
        icon: "🔐",
        description: "Protect computer systems and digital information.",
        skills: ["Python", "Java"],
        interest: "Cyber Security",
        related: ["Python", "Java"]
    },
    {
        name: "App Developer",
        icon: "📱",
        description: "Develop useful applications for mobile devices.",
        skills: ["Java", "JavaScript"],
        interest: "App Development",
        related: ["Java", "JavaScript"]
    },
    {
        name: "Software Developer",
        icon: "⚙️",
        description: "Design and develop software solutions.",
        skills: ["Java", "Python", "SQL"],
        interest: "Software Development",
        related: ["Java", "Python", "SQL"]
    }
];

// =====================================
// CAREER ASSESSMENT
// =====================================

const careerForm = document.getElementById("careerForm");

careerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const education = document.getElementById("education").value;
    const interest = document.getElementById("interest").value;
    const goal = document.getElementById("goal").value;

    const selectedSkills = Array.from(
        document.querySelectorAll('input[name="skills"]:checked')
    ).map(function(skill) {
        return skill.value;
    });

    if (selectedSkills.length === 0) {
        alert("Please select at least one technical skill.");
        return;
    }

    // Calculate career match scores
    const recommendations = careerData.map(function(career) {

        let score = 30;

        // Interest matching
        if (career.interest === interest) {
            score += 45;
        }

        // Skill matching
        const matchedSkills = career.related.filter(function(skill) {
            return selectedSkills.includes(skill);
        });

        score += matchedSkills.length * 12;

        // Education matching
        if (["BCA", "MCA", "B.Tech", "M.Tech", "B.Sc"].includes(education)) {
            score += 5;
        }

        // Limit score to 99
        score = Math.min(score, 99);

        return {
            ...career,
            score: score,
            matchedSkills: matchedSkills
        };
    });

    // Sort highest score first
    recommendations.sort(function(a, b) {
        return b.score - a.score;
    });

    // Show top 3 recommendations
    displayResults(name, recommendations.slice(0, 3));

    // Save assessment result in browser
    const studentData = {
        name: name,
        education: education,
        interest: interest,
        goal: goal,
        skills: selectedSkills,
        recommendations: recommendations.slice(0, 3),
        date: new Date().toLocaleDateString()
    };

    localStorage.setItem("careerAIStudent", JSON.stringify(studentData));
    

// Send Career Assessment Data to Backend API
fetch("http://localhost:5000/api/assessment", {
    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        studentName: name,
        education: education,
        interest: interest,
        goal: goal,
        skills: selectedSkills
    })
})
.then(function(response) {
    if (!response.ok) {
        throw new Error("Backend API Error");
    }
    return response.json();
})
.then(function(data) {
    console.log("Backend Response:", data);
    console.log("Career Assessment sent successfully!");
})
.catch(function(error) {
    console.error("Backend Connection Error:", error);
});

});

// =====================================
// DISPLAY CAREER RESULTS
// =====================================

function displayResults(name, recommendations) {

    const resultsSection = document.getElementById("results");
    const resultGreeting = document.getElementById("resultGreeting");
    const resultCards = document.getElementById("resultCards");

    resultGreeting.textContent =
        "Hello " + name + "! Here are your top career matches.";

    resultCards.innerHTML = "";

    recommendations.forEach(function(career) {

        const card = document.createElement("div");
        card.className = "career-card";

        const title = document.createElement("h3");
        title.textContent = career.icon + " " + career.name;

        const description = document.createElement("p");
        description.textContent = career.description;

        const score = document.createElement("div");
        score.className = "match-score";
        score.textContent = career.score + "% Match";

        const bar = document.createElement("div");
        bar.className = "match-bar";

        const fill = document.createElement("div");
        fill.className = "match-fill";
        fill.style.width = career.score + "%";

        bar.appendChild(fill);

        const skills = document.createElement("p");
        skills.style.marginTop = "12px";
        skills.textContent =
            "Matched Skills: " +
            (career.matchedSkills.length
                ? career.matchedSkills.join(", ")
                : "Keep learning new skills");

        const roadmapButton = document.createElement("button");
        roadmapButton.className = "primary-btn";
        roadmapButton.style.marginTop = "15px";
        roadmapButton.style.width = "100%";
        roadmapButton.textContent = "View Learning Roadmap";

        roadmapButton.addEventListener("click", function() {
            document.getElementById("roadmap").scrollIntoView({
                behavior: "smooth"
            });
        });

        card.append(
            title,
            description,
            score,
            bar,
            skills,
            roadmapButton
        );

        resultCards.appendChild(card);
    });

    resultsSection.hidden = false;

    setTimeout(function() {
        resultsSection.scrollIntoView({
            behavior: "smooth"
        });
    }, 100);
}

// =====================================
// LOAD SAVED STUDENT DATA
// =====================================

window.addEventListener("DOMContentLoaded", function() {

    const savedData = localStorage.getItem("careerAIStudent");

    if (savedData) {
        console.log(
            "Saved CareerAI Student Data:",
            JSON.parse(savedData)
        );
    }
});
async function fetchAssessments() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/assessments"
        );

        const result = await response.json();

        const container =
            document.getElementById("assessmentData");

        container.innerHTML = "";

        if (result.success) {

            result.data.forEach(student => {

                const card = document.createElement("div");

                card.className = "student-card";

                const name = document.createElement("h3");
                name.textContent = student.student_name;

                const education = document.createElement("p");
                education.textContent = "Education: " + student.education;

                const interest = document.createElement("p");
                interest.textContent = "Interest: " + student.interest;

                const goal = document.createElement("p");
                goal.textContent = "Goal: " + student.goal;

                const skills = document.createElement("p");

                let skillArray = JSON.parse(student.skills);

                skills.textContent =
                    "Skills: " + skillArray.join(", ");

                card.append(name, education, interest, goal, skills);

                container.appendChild(card);

            });

        }

    } catch (error) {

        console.log("Fetch Error:", error);

    }
}

fetchAssessments();
