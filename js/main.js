let allModules = [];
let activeCategory = "all";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initThemeToggle();
    initFaqAccordion();
    loadCommandsData();
});

function initMobileMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
        });
    });
}

function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeLabel = document.getElementById("theme-label");

    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);

    toggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
        themeLabel.textContent = theme === "dark" ? "Jasny" : "Ciemny";
    }
}

function loadCommandsData() {
    const searchInput = document.getElementById("search-input");
    const filterButtons = document.querySelectorAll(".filter-btn");

    fetch("data/commands.json")
        .then(response => response.json())
        .then(data => {
            allModules = data;
            filterAndRender();
        })
        .catch(err => console.error("Błąd ładowania pliku JSON:", err));

    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterAndRender();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.getAttribute("data-category");
            filterAndRender();
        });
    });
}

function filterAndRender() {
    const grid = document.getElementById("cheatsheet-grid");
    const noResults = document.getElementById("no-results");
    const counter = document.getElementById("results-counter");

    const filtered = allModules.filter(item => {
        const matchesCat = activeCategory === "all" || item.category === activeCategory;
        if (!matchesCat) return false;
        if (!searchQuery) return true;

        const matchTitle = item.title.toLowerCase().includes(searchQuery);
        const matchCat = item.categoryLabel.toLowerCase().includes(searchQuery);
        const matchCmd = item.commands.some(cmd =>
            cmd.desc.toLowerCase().includes(searchQuery) || cmd.code.toLowerCase().includes(searchQuery)
        );

        return matchTitle || matchCat || matchCmd;
    });

    if (filtered.length === 0) {
        grid.innerHTML = "";
        noResults.hidden = false;
        counter.textContent = "Znaleziono modułów: 0";
        return;
    }

    noResults.hidden = true;
    counter.textContent = `Wyświetlanie modułów: ${filtered.length} z ${allModules.length}`;

    grid.innerHTML = filtered.map(item => `
        <article class="module-card">
            <div class="module-header">
                <span class="module-category">${item.categoryLabel}</span>
                <h3>${item.title}</h3>
            </div>
            <ul class="cmd-list">
                ${item.commands.map(cmd => `
                    <li>
                        <p class="cmd-desc">${cmd.desc}</p>
                        <pre class="cmd-code"><code>${cmd.code}</code></pre>
                    </li>
                `).join("")}
            </ul>
        </article>
    `).join("");
}

function initFaqAccordion() {
    const triggers = document.querySelectorAll(".faq-trigger");

    triggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const panel = trigger.closest(".faq-item").querySelector(".faq-panel");
            const icon = trigger.querySelector(".faq-icon");
            const isCurrentlyOpen = !panel.hidden;

            document.querySelectorAll(".faq-panel").forEach(p => p.hidden = true);
            document.querySelectorAll(".faq-icon").forEach(i => i.textContent = "+");

            if (!isCurrentlyOpen) {
                panel.hidden = false;
                icon.textContent = "-";
            }
        });
    });
}