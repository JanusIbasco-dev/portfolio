(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealSelector = ".reveal";
  let soundEnabled = false;
  const audioContext = window.AudioContext ? new window.AudioContext() : null;

  function clickFeedback() {
    if (!soundEnabled || !audioContext) {
      return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = 520;
    gain.gain.value = 0.02;

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.04);

    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  function initReveal() {
    const items = document.querySelectorAll(revealSelector);
    if (prefersReducedMotion) {
      items.forEach((node) => node.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
  }

  window.observeRevealElements = initReveal;

  function initThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      document.body.classList.add("light");
      toggle.textContent = "Dark";
    }

    toggle.addEventListener("click", () => {
      document.body.classList.toggle("light");
      const light = document.body.classList.contains("light");
      localStorage.setItem("theme", light ? "light" : "dark");
      toggle.textContent = light ? "Dark" : "Light";
      clickFeedback();
    });
  }

  function initSkillMeters() {
    const cards = document.querySelectorAll(".skill-card");
    cards.forEach((card) => {
      const level = card.dataset.level;
      const bar = card.querySelector(".meter span");
      if (bar) {
        requestAnimationFrame(() => {
          bar.style.width = `${level}%`;
        });
      }
    });
  }

  function projectCard(project) {
    const tags = project.stack.map((tag) => `<span class="chip">${tag}</span>`).join("");
    const demo = project.demo ? `<a class="btn" href="${project.demo}" target="_blank" rel="noreferrer">Live Demo</a>` : "";
    return `
      <article class="project-card reveal" data-category="${project.category}">
        <h4>${project.title}</h4>
        <p>${project.description}</p>
        <div class="project-tags">${tags}</div>
        <div class="card-links">
          <a class="btn" href="${project.github}" target="_blank" rel="noreferrer">GitHub</a>
          ${demo}
        </div>
      </article>
    `;
  }

  function initProjects() {
    const grid = document.getElementById("project-grid");
    const filters = document.getElementById("project-filters");
    const data = window.featuredProjects || [];

    grid.innerHTML = data.map(projectCard).join("");

    filters.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) {
        return;
      }

      filters.querySelectorAll("button").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;

      document.querySelectorAll("#project-grid .project-card").forEach((card) => {
        const category = card.dataset.category;
        const show = filter === "all" || filter === category;
        card.style.display = show ? "block" : "none";
      });
      clickFeedback();
    });
  }

  function initOrbInteraction() {
    const orb = document.getElementById("hero-orb");
    if (!orb || prefersReducedMotion) {
      return;
    }

    window.addEventListener("mousemove", (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * 18;
      orb.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
    });
  }

  function initParticles() {
    const canvas = document.getElementById("particles");
    if (!canvas || prefersReducedMotion) {
      return;
    }

    const context = canvas.getContext("2d");
    const particles = [];
    const count = 52;
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function spawn() {
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }

    function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          particle.x -= dx * 0.003;
          particle.y -= dy * 0.003;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fillStyle = "rgba(114, 168, 255, 0.45)";
        context.fill();
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", () => {
      resize();
      spawn();
    });

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    resize();
    spawn();
    draw();
  }

  function terminalPrint(text) {
    const log = document.getElementById("terminal-log");
    const line = document.createElement("p");
    line.textContent = text;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  }

  function initTerminal() {
    const form = document.getElementById("terminal-form");
    const input = document.getElementById("terminal-input");
    terminalPrint("Type 'help' to explore this portfolio.");

    const commands = {
      help: "Commands: help, about, skills, projects, contact, theme, clear",
      about: "Janus Ibasco is an IT student focused on modern web and app development.",
      skills: "Core: HTML/CSS/JS, React, UI/UX, API Integration, Backend Basics, GitHub",
      projects: "Jumping to projects section...",
      contact: "Email: janusibasco433@gmail.com",
      theme: "Toggling theme..."
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const raw = input.value.trim().toLowerCase();
      if (!raw) {
        return;
      }

      terminalPrint(`> ${raw}`);

      if (raw === "clear") {
        document.getElementById("terminal-log").innerHTML = "";
      } else if (raw === "projects") {
        terminalPrint(commands.projects);
        document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
      } else if (raw === "contact") {
        terminalPrint(commands.contact);
        document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
      } else if (raw === "theme") {
        terminalPrint(commands.theme);
        document.getElementById("theme-toggle").click();
      } else {
        terminalPrint(commands[raw] || "Unknown command. Type 'help'.");
      }

      input.value = "";
      clickFeedback();
    });
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const note = document.getElementById("form-note");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      note.textContent = "Thanks! Your message is prepared. Please send via your email client.";
      form.reset();
      clickFeedback();
    });
  }

  function initSoundToggle() {
    const toggle = document.getElementById("sound-toggle");
    toggle.addEventListener("click", async () => {
      if (audioContext && audioContext.state === "suspended") {
        await audioContext.resume();
      }

      soundEnabled = !soundEnabled;
      toggle.textContent = soundEnabled ? "Sound: On" : "Sound: Off";
      clickFeedback();
    });
  }

  function hideSplash() {
    const splash = document.getElementById("splash");
    window.setTimeout(() => splash.classList.add("hide"), 550);
  }

  function bootstrap() {
    hideSplash();
    initThemeToggle();
    initSoundToggle();
    initReveal();
    initSkillMeters();
    initProjects();
    initOrbInteraction();
    initParticles();
    initTerminal();
    initContactForm();
    if (window.loadGitHubData) {
      window.loadGitHubData();
    }

    document.querySelectorAll("button, a").forEach((node) => {
      node.addEventListener("click", clickFeedback);
    });
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
})();

