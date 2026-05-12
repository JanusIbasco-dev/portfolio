(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealSelector = ".reveal";

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
      help: "Commands: help, about, intro, skills, journey, theme, clear",
      about: "Janus Ibasco is an IT student focused on web and app development, currently working on a student-focused AI web app.",
      intro: "Jumping to the introduction section...",
      skills: "Core: HTML/CSS/JS, React, UI/UX, API Integration, Backend Basics, GitHub",
      journey: "Jumping to goals section...",
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
      } else if (raw === "intro") {
        terminalPrint(commands.intro);
        document.getElementById("introduction").scrollIntoView({ behavior: "smooth" });
      } else if (raw === "journey") {
        terminalPrint(commands.journey);
        document.getElementById("journey").scrollIntoView({ behavior: "smooth" });
      } else if (raw === "theme") {
        terminalPrint(commands.theme);
        document.getElementById("theme-toggle").click();
      } else {
        terminalPrint(commands[raw] || "Unknown command. Type 'help'.");
      }

      input.value = "";
    });
  }

  function hideSplash() {
    const splash = document.getElementById("splash");
    window.setTimeout(() => splash.classList.add("hide"), 550);
  }

  function bootstrap() {
    hideSplash();
    initThemeToggle();
    initReveal();
    initSkillMeters();
    initOrbInteraction();
    initParticles();
    initTerminal();
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
})();

