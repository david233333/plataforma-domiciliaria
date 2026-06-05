# Product

## Register

product

## Users

Internal clinical and operations staff at a home-healthcare provider ("salud en casa"). They coordinate domiciliary care across two tracks: **hospitalario** (hospital-linked patients) and **no-hospitalario** (ambulatory/home requests). On any given screen they are in a task: triaging solicitudes (care requests), gestionar novedades (resolving incidents/exceptions on a remission), and consulting informes (operational reports). Context is a desk or workstation during a shift, light ambient office lighting, often under time pressure with patient-facing consequences. Spanish-language UI.

## Product Purpose

A single operational platform to manage the lifecycle of home-care remissions: intake, incident management, and reporting. Success is measured by how quickly and confidently a coordinator can find a case, understand its state, act on it correctly, and report on the operation, with zero ambiguity about clinical state. The tool should disappear into the task.

## Brand Personality

Clinical, trustworthy, calm. Voice is precise and plain (Spanish), never playful or marketing-y. The interface conveys quiet competence: nothing flashy, nothing that introduces doubt about data correctness or system state. Emotional goal: a coordinator should feel the system is dependable and unsurprising.

## Anti-references

- Consumer health/wellness apps (gradients, big rounded cards, emoji, motivational copy). This is an operational tool, not a wellness brand.
- Generic SaaS-dashboard slop: hero-metric blocks with gradient accents, identical icon+heading+text card grids, decorative glassmorphism.
- Over-animated, choreographed page loads. Clinicians do not want to watch the page assemble.
- Any tell that reads "AI-generated template": tracked uppercase eyebrows over every section, gradient text, side-stripe accent borders.

## Design Principles

- **Clinical state is never ambiguous.** Status, severity, and dates use a standardized, AA-contrast semantic vocabulary; color is never the only signal.
- **Consistency over surprise.** Same control vocabulary screen to screen (PrimeNG + the `--app-*` token system). A given action looks identical everywhere.
- **Density with restraint.** Show the information a coordinator needs without decoration; whitespace and hierarchy carry the load, not chrome.
- **Earned familiarity.** Standard affordances for standard tasks (tables, filters, dialogs). No reinvented controls.
- **Accessible by construction.** WCAG AA is the floor, already encoded in the token ramps; new work must not regress it.

## Accessibility & Inclusion

Target **WCAG 2.1 AA** (the token system documents per-pair contrast ratios and targets 4.5:1 body / 3:1 large+UI). Light mode only by design decision. Requirements: visible focus indicators, full keyboard operability of tables/filters/dialogs, semantic landmarks and heading order, form inputs with associated labels and accessible error messaging, and `prefers-reduced-motion` honored on all motion. Color must never be the sole carrier of meaning (pair with text/icon).
