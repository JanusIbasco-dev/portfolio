# Janus Ibasco - Interactive Developer Portfolio

A premium-style personal portfolio website with an immersive hero, animated background, interactive terminal navigation, project filtering, and live GitHub integration.

## Features

- Dark mode by default with light mode toggle
- Glassmorphism UI with gradient accents and subtle motion
- Interactive hero orb reacting to pointer movement
- Terminal-style command panel (`help`, `about`, `projects`, `contact`, `theme`)
- Skills cards with animated progress meters
- Filterable project section (Web Apps, UI Experiments, Systems Projects)
- GitHub profile integration (`JanusIbasco-dev`) with stats, repo cards, and activity heatmap
- Responsive layout for desktop, tablet, and mobile
- Contact section with animated form controls

## Project Structure

- `index.html`
- `assets/css/styles.css`
- `assets/css/responsive.css`
- `assets/js/main.js`
- `assets/js/github.js`
- `assets/js/projects.js`
- `tests/validate-structure.ps1`

## Quick Start

Run a local static server from the project root:

```powershell
python -m http.server 5500
```

Open `http://localhost:5500` in your browser.

## Validate Basic Structure

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tests\validate-structure.ps1
```

