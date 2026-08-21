const root = document.documentElement;
root.classList.add("js-enabled");
const themeButton = document.getElementById("theme-button");
const themeLabel = themeButton.querySelector(".theme-toggle__label");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sectionElements = [...document.querySelectorAll("main section[id]")];
const careerTabs = [...document.querySelectorAll("[role='tab'][data-target]")];
const careerPanels = [...document.querySelectorAll("[role='tabpanel'][data-content]")];
const terminalForm = document.getElementById("terminal-form");
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");
const splitRevealElements = [...document.querySelectorAll("[data-split-reveal]")];
const magnetElements = [...document.querySelectorAll("[data-magnet]")];
const projectCards = [...document.querySelectorAll("[data-project-card]")];
const profileStats = document.querySelector(".profile-stats");
const certificatePreviewButtons = [...document.querySelectorAll("[data-certificate-preview]")];
const certificateDialog = document.getElementById("certificate-dialog");
const certificateDialogTitle = document.getElementById("certificate-dialog-title");
const certificateDialogImage = document.getElementById("certificate-dialog-image");
const certificateDialogPdf = document.getElementById("certificate-dialog-pdf");
const certificateDialogClose = document.getElementById("certificate-dialog-close");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let profileStatsVisible = false;

const syncProfileStatsMotion = () => {
  if (!profileStats) return;
  profileStats.classList.toggle("is-motion-active", profileStatsVisible && !document.hidden && !reducedMotion.matches);
};

const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme, persist = false) => {
  root.dataset.colorMode = theme;
  themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
  themeButton.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
  document.querySelector("meta[name='theme-color']").setAttribute("content", theme === "dark" ? "#080b1d" : "#eef2ff");
  if (persist) localStorage.setItem("portfolio-theme", theme);
};

const toggleTheme = () => {
  const nextTheme = root.dataset.colorMode === "dark" ? "light" : "dark";
  applyTheme(nextTheme, true);
  return nextTheme;
};

applyTheme(getPreferredTheme());
themeButton.addEventListener("click", toggleTheme);

const closeMenu = () => {
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

navToggle.addEventListener("click", () => {
  const willOpen = !navMenu.classList.contains("is-open");
  navMenu.classList.toggle("is-open", willOpen);
  navToggle.setAttribute("aria-expanded", String(willOpen));
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
  if (event.key === "/" && document.activeElement !== terminalInput && !certificateDialog.open) {
    event.preventDefault();
    terminalInput.focus();
  }
});

certificatePreviewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    certificateDialogTitle.textContent = button.dataset.title;
    certificateDialogImage.src = button.dataset.image;
    certificateDialogImage.alt = `${button.dataset.title} certificate`;
    certificateDialogPdf.href = button.dataset.pdf;
    certificateDialog.showModal();
  });
});

certificateDialogClose.addEventListener("click", () => certificateDialog.close());
certificateDialog.addEventListener("click", (event) => {
  if (event.target === certificateDialog) certificateDialog.close();
});

careerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    careerTabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-selected", String(selected));
    });

    careerPanels.forEach((panel) => {
      const selected = `#${panel.id}` === tab.dataset.target;
      panel.hidden = !selected;
      panel.classList.toggle("qualification__active", selected);
    });
  });
});

const terminalCommands = {
  help: () => "Available: about, skills, experience, projects, certificates, contact, resume, theme, clear",
  about: () => navigateTo("about", "Opening README.md"),
  skills: () => navigateTo("skills", "Opening technical stack"),
  experience: () => navigateTo("qualifications", "Opening qualifications"),
  projects: () => navigateTo("portfolio", "Opening selected projects"),
  certificate: () => navigateTo("certificates", "Opening professional certificates"),
  certificates: () => navigateTo("certificates", "Opening professional certificates"),
  contact: () => navigateTo("contact", "Opening contact details"),
  resume: () => {
    window.open("assets/resume/Resume_LimKimHoong.pdf", "_blank", "noopener,noreferrer");
    return "Opening Resume_LimKimHoong.pdf";
  },
  theme: () => `Theme switched to ${toggleTheme()}`,
  clear: () => ""
};

function navigateTo(sectionId, message) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth", block: "start" });
  return message;
}

terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = terminalInput.value.trim().toLowerCase();

  if (!command) {
    terminalOutput.textContent = "Type help to see the available commands.";
    terminalOutput.dataset.state = "error";
    return;
  }

  if (!terminalCommands[command]) {
    terminalOutput.textContent = `Command not found: ${command}. Try help.`;
    terminalOutput.dataset.state = "error";
  } else {
    terminalOutput.textContent = terminalCommands[command]();
    terminalOutput.dataset.state = "success";
  }

  terminalInput.value = "";
});

splitRevealElements.forEach((element) => {
  const words = element.textContent.trim().split(/\s+/);
  element.setAttribute("aria-label", words.join(" "));
  element.replaceChildren(...words.map((word, index) => {
    const span = document.createElement("span");
    span.className = "reveal-word";
    span.style.setProperty("--word-index", index);
    span.setAttribute("aria-hidden", "true");
    span.textContent = word;
    return span;
  }));
});

magnetElements.forEach((element) => {
  const resetMagnet = () => {
    element.style.transform = "translate3d(0, 0, 0)";
  };

  element.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches || event.pointerType === "touch") return;
    const bounds = element.getBoundingClientRect();
    const offsetX = event.clientX - (bounds.left + bounds.width / 2);
    const offsetY = event.clientY - (bounds.top + bounds.height / 2);
    element.style.transform = `translate3d(${offsetX / 18}px, ${offsetY / 18}px, 0)`;
  });

  element.addEventListener("pointerleave", resetMagnet);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
  splitRevealElements.forEach((element) => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => link.classList.toggle("active-link", link.hash === `#${visible.target.id}`));
  }, { rootMargin: "-25% 0px -62%", threshold: [0.01, 0.2, 0.6] });

  sectionElements.forEach((section) => sectionObserver.observe(section));

  const stackObserver = new IntersectionObserver((entries) => {
    const activeCard = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

    if (!activeCard) return;
    const activeIndex = projectCards.indexOf(activeCard.target);
    projectCards.forEach((card, index) => card.classList.toggle("is-behind", index < activeIndex));
  }, { rootMargin: "-18% 0px -62%", threshold: 0.01 });

  projectCards.forEach((card) => stackObserver.observe(card));

  if (profileStats) {
    const profileStatsObserver = new IntersectionObserver(([entry]) => {
      profileStatsVisible = entry.isIntersecting;
      syncProfileStatsMotion();
    }, { rootMargin: "80px 0px", threshold: 0.08 });

    profileStatsObserver.observe(profileStats);
  }
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
  splitRevealElements.forEach((element) => element.classList.add("is-visible"));
  profileStatsVisible = true;
  syncProfileStatsMotion();
}

document.addEventListener("visibilitychange", syncProfileStatsMotion);
reducedMotion.addEventListener?.("change", syncProfileStatsMotion);
