# CV ATS Express — Agent Instructions

Before non-trivial work, read:

1. `docs/INDEX.md`
2. `docs/product/PRODUCT.md`
3. `docs/context/PROJECT_STATE.md`
4. `docs/architecture/ARCHITECTURE.md`
5. `docs/architecture/DECISIONS.md` when architecture may be affected

Repository documentation is the project's durable memory. Executable code is the source of truth for implemented behavior; investigate and correct documentation when they disagree.

Do not silently change accepted architecture. Significant changes require a decision record, relevant ADR updates, and updates to project state. Use an ExecPlan under `docs/plans/` for complex features or structural work.

Keep offline features independent from backends. UI depends on application contracts, never directly on native storage, AI providers, billing, or remote services. Do not expose secrets or claim planned work as complete.

After meaningful implementation, run applicable tests, lint, build, and Capacitor sync; review the diff; then update `PROJECT_STATE.md`, `HANDOFF.md`, `CHANGELOG_AI.md`, and known issues.
